from __future__ import annotations

import base64
import hashlib
import io
import json
from datetime import datetime
from typing import Any

from actian_vectorai import PointStruct

from app.embeddings import EmbeddingModel, embedding_router
from app.vectordb import VectorDBClient


class SourceParser:
    def parse(self, source_type: str, content: str) -> str:
        if source_type in {"text", "markdown", "transcript"}:
            return content

        if source_type == "conversation_history_json":
            return self._parse_conversation(content)

        if source_type == "pdf":
            return self._parse_pdf(content)

        if source_type == "url":
            return self._parse_url(content)

        return content

    @staticmethod
    def _parse_conversation(content: str) -> str:
        try:
            loaded = json.loads(content)
            if isinstance(loaded, dict) and "messages" in loaded:
                loaded = loaded["messages"]
            if not isinstance(loaded, list):
                return content
            lines: list[str] = []
            for message in loaded:
                role = str(message.get("role", "user")).upper()
                body = str(message.get("content", "")).strip()
                if body:
                    lines.append(f"{role}: {body}")
            return "\n".join(lines)
        except Exception:
            return content

    @staticmethod
    def _parse_pdf(content: str) -> str:
        try:
            from pypdf import PdfReader

            data = base64.b64decode(content)
            reader = PdfReader(io.BytesIO(data))
            return "\n\n".join((page.extract_text() or "") for page in reader.pages)
        except Exception as exc:
            raise ValueError(f"Unable to parse PDF content: {exc}") from exc

    @staticmethod
    def _parse_url(content: str) -> str:
        try:
            import httpx
            from bs4 import BeautifulSoup

            response = httpx.get(content, timeout=20, follow_redirects=True)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            return soup.get_text(separator="\n", strip=True)
        except Exception as exc:
            raise ValueError(f"Unable to load URL content: {exc}") from exc


class TextChunker:
    def __init__(self, chunk_size: int = 512, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def split(self, text: str) -> list[str]:
        words = text.split()
        if not words:
            return []

        chunks: list[str] = []
        step = max(1, self.chunk_size - self.overlap)
        start = 0

        while start < len(words):
            end = min(start + self.chunk_size, len(words))
            chunk = " ".join(words[start:end]).strip()
            if chunk:
                chunks.append(chunk)
            start += step

        return chunks


class IngestionService:
    def __init__(self, vectordb: VectorDBClient):
        self._vectordb = vectordb
        self._parser = SourceParser()
        self._chunker = TextChunker()

    @staticmethod
    def _point_id(resource_id: str, chunk_index: int) -> int:
        digest = hashlib.sha1(f"{resource_id}:{chunk_index}".encode()).hexdigest()
        return int(digest[:15], 16)

    def ingest(
        self,
        *,
        collection_name: str,
        source_type: str,
        content: str,
        metadata: dict[str, Any],
        embedding_model: EmbeddingModel | None,
        expected_dim: int,
    ) -> int:
        parsed = self._parser.parse(source_type, content)
        if not parsed.strip():
            raise ValueError("No content extracted from source")

        chunks = self._chunker.split(parsed)
        if not chunks:
            raise ValueError("No chunks produced from source")

        selected_model = embedding_model or embedding_router.select_for_source(source_type, len(chunks))
        vectors = embedding_router.embed_texts(chunks, model=selected_model)

        if vectors and len(vectors[0]) != expected_dim:
            raise ValueError(
                f"Embedding dimension mismatch for KB. Expected {expected_dim}, got {len(vectors[0])}."
            )

        created_at = metadata.get("created_at") or datetime.utcnow().isoformat()
        resource_id = str(metadata.get("resource_id", ""))

        points = []
        for idx, (chunk, vector) in enumerate(zip(chunks, vectors)):
            payload = {
                "text": chunk,
                "chunk_index": idx,
                "source_type": source_type,
                "resource_id": resource_id,
                "kb_id": metadata.get("kb_id", ""),
                "instance_id": metadata.get("instance_id", ""),
                "namespace_id": metadata.get("namespace_id", "company_docs"),
                "source_ref": metadata.get("source_ref", ""),
                "user_id": metadata.get("user_id", ""),
                "session_id": metadata.get("session_id", ""),
                "created_at": created_at,
            }
            points.append(
                PointStruct(
                    id=self._point_id(resource_id=resource_id, chunk_index=idx),
                    vector=vector,
                    payload=payload,
                )
            )

        self._vectordb.upsert_points(collection_name, points)
        return len(points)
