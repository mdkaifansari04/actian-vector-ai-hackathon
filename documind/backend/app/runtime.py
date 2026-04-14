from __future__ import annotations

from dataclasses import dataclass

from app.config import settings
from app.database import get_store
from app.embeddings import EmbeddingModel
from app.embeddings import embedding_router
from app.routing import RoutingService
from app.services.agent import AgentService
from app.services.ingestion import IngestionService
from app.services.observability import ObservabilityService
from app.services.retrieval import RetrievalService
from app.vectordb import VectorDBClient


@dataclass
class AppContainer:
    vectordb: VectorDBClient
    store: any
    routing: RoutingService
    ingestion: IngestionService
    retrieval: RetrievalService
    agent: AgentService
    observability: ObservabilityService


vectordb = VectorDBClient(settings.vectordb_url)
store = get_store()
routing = RoutingService()
ingestion = IngestionService(vectordb=vectordb)
retrieval = RetrievalService(vectordb=vectordb)
agent = AgentService()
observability = ObservabilityService()

container = AppContainer(
    vectordb=vectordb,
    store=store,
    routing=routing,
    ingestion=ingestion,
    retrieval=retrieval,
    agent=agent,
    observability=observability,
)


def make_collection_name(instance_id: str, kb_id: str) -> str:
    return f"kb_{instance_id[:8]}_{kb_id[:8]}"


def model_from_str(value: str):
    return EmbeddingModel(value)
