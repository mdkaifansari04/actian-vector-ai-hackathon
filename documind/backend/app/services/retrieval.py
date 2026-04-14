from __future__ import annotations

from typing import Any

from actian_vectorai import Field, FilterBuilder

from app.embeddings import EmbeddingModel, embedding_router
from app.vectordb import VectorDBClient


class RetrievalService:
    def __init__(self, vectordb: VectorDBClient):
        self._vectordb = vectordb

    @staticmethod
    def _format_results(results: list[Any]) -> list[dict[str, Any]]:
        formatted: list[dict[str, Any]] = []
        for row in results:
            payload = row.payload or {}
            formatted.append(
                {
                    "id": row.id,
                    "text": payload.get("text", ""),
                    "score": float(row.score),
                    "source_ref": payload.get("source_ref", ""),
                    "chunk_index": int(payload.get("chunk_index", 0)),
                    "resource_id": payload.get("resource_id", ""),
                    "namespace_id": payload.get("namespace_id", ""),
                }
            )
        return formatted

    def search_knowledge_base(
        self,
        *,
        collection_name: str,
        query: str,
        top_k: int = 5,
        embedding_model: EmbeddingModel | None = None,
        filters: Any = None,
    ) -> list[dict[str, Any]]:
        query_vector = embedding_router.embed_query(query, model=embedding_model)
        results = self._vectordb.search(collection_name, vector=query_vector, top_k=top_k, filters=filters)
        return self._format_results(results)

    def search_memory(
        self,
        *,
        collection_name: str,
        query: str,
        user_id: str,
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        memory_filter = FilterBuilder().must(Field("user_id").eq(user_id)).build()
        return self.search_knowledge_base(
            collection_name=collection_name,
            query=query,
            top_k=top_k,
            embedding_model=EmbeddingModel.MINILM,
            filters=memory_filter,
        )
