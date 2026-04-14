from __future__ import annotations

import asyncio
import time

from fastapi import APIRouter, HTTPException

from app.embeddings import EmbeddingModel
from app.models.schemas import QueryRequest, SearchRequest
from app.runtime import container


class QueryRouter:
    def __init__(self):
        self.router = APIRouter(tags=["query"])
        self.router.add_api_route("/search", self.search, methods=["POST"])
        self.router.add_api_route("/query", self.query, methods=["POST"])

    async def search(self, body: SearchRequest):
        kb = container.store.get_knowledge_base(body.kb_id)
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")

        results = await asyncio.to_thread(
            container.retrieval.search_knowledge_base,
            collection_name=kb["collection_name"],
            query=body.query,
            top_k=body.top_k,
            embedding_model=EmbeddingModel(kb["embedding_model"]),
        )
        return {"kb_id": body.kb_id, "results": results}

    async def query(self, body: QueryRequest):
        kb = container.store.get_knowledge_base(body.kb_id)
        if not kb:
            raise HTTPException(status_code=404, detail="Knowledge base not found")

        start = time.time()
        sources = await asyncio.to_thread(
            container.retrieval.search_knowledge_base,
            collection_name=kb["collection_name"],
            query=body.question,
            top_k=body.top_k,
            embedding_model=EmbeddingModel(kb["embedding_model"]),
        )
        answer = await asyncio.to_thread(container.agent.answer, question=body.question, sources=sources)
        response_ms = int((time.time() - start) * 1000)

        retrieval_score = sum(item["score"] for item in sources) / len(sources) if sources else 0.0
        container.store.create_query_log(
            knowledge_base_id=body.kb_id,
            query=body.question,
            chunks_retrieved=len(sources),
            response_ms=response_ms,
            retrieval_score=retrieval_score,
            chunk_relevance=retrieval_score,
            hallucination_rate=0.0,
        )

        return {
            "answer": answer,
            "sources": sources,
            "response_ms": response_ms,
        }


router = QueryRouter().router
