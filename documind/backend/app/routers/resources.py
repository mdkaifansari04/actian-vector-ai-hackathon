from __future__ import annotations

import asyncio
import base64
from datetime import datetime

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile

from app.embeddings import EmbeddingModel
from app.runtime import container


class ResourceRouter:
    def __init__(self):
        self.router = APIRouter(prefix="/resources", tags=["resources"])
        self.router.add_api_route("", self.ingest_resource, methods=["POST"])
        self.router.add_api_route("", self.list_resources, methods=["GET"])

    async def ingest_resource(
        self,
        kb_id: str = Form(...),
        source_type: str = Form(...),
        content: str | None = Form(default=None),
        file: UploadFile | None = File(default=None),
        source_ref: str = Form(default=""),
        user_id: str = Form(default=""),
        session_id: str = Form(default=""),
    ):
        kb = container.store.get_knowledge_base(kb_id)
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")

        if file is not None and not content:
            raw = await file.read()
            source_ref = source_ref or file.filename or "upload"
            if source_type == "pdf":
                content = base64.b64encode(raw).decode("utf-8")
            else:
                content = raw.decode("utf-8", errors="replace")

        if not content:
            raise HTTPException(status_code=400, detail="Provide either content or file")

        resource = container.store.create_resource(
            knowledge_base_id=kb_id,
            source_type=source_type,
            source_ref=source_ref,
            status="processing",
        )

        metadata = {
            "resource_id": resource["id"],
            "kb_id": kb_id,
            "instance_id": kb["instance_id"],
            "namespace_id": kb["namespace_id"],
            "source_ref": source_ref,
            "user_id": user_id,
            "session_id": session_id,
            "created_at": datetime.utcnow().isoformat(),
        }

        try:
            model = EmbeddingModel(kb["embedding_model"])
            chunks_indexed = await asyncio.to_thread(
                container.ingestion.ingest,
                collection_name=kb["collection_name"],
                source_type=source_type,
                content=content,
                metadata=metadata,
                embedding_model=model,
                expected_dim=int(kb["embedding_dim"]),
            )
            container.store.update_resource(resource["id"], status="done", chunks_indexed=chunks_indexed)
            return {
                "status": "success",
                "resource_id": resource["id"],
                "chunks_indexed": chunks_indexed,
            }
        except Exception as exc:
            container.store.update_resource(resource["id"], status="failed")
            raise HTTPException(status_code=500, detail=str(exc)) from exc

    async def list_resources(self, kb_id: str = Query(...)):
        kb = container.store.get_knowledge_base(kb_id)
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")
        return container.store.list_resources(kb_id)


router = ResourceRouter().router
