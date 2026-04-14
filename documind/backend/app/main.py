from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import instances, knowledge_bases, memory, observability, query, resources
from app.runtime import container


class DocuMindApplication:
    def __init__(self):
        self.app = FastAPI(title="DocuMind API", version="1.0.0")
        self._configure_middleware()
        self._configure_routes()

    def _configure_middleware(self) -> None:
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origin_list,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def _configure_routes(self) -> None:
        self.app.include_router(instances.router)
        self.app.include_router(knowledge_bases.router)
        self.app.include_router(resources.router)
        self.app.include_router(query.router)
        self.app.include_router(memory.router)
        self.app.include_router(observability.router)

        @self.app.get("/health", tags=["system"])
        async def health_check():
            info = container.vectordb.health_check()
            return {"status": "ok", "vectordb": info}

        @self.app.get("/collections", tags=["system"])
        async def list_collections():
            return {
                "collections": container.vectordb.list_collections(),
                "knowledge_bases": container.store.list_knowledge_bases(),
            }


application = DocuMindApplication()
app = application.app
