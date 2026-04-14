from __future__ import annotations

from enum import Enum
from functools import lru_cache

from app.config import settings


class EmbeddingModel(str, Enum):
    MINILM = "minilm"
    BGE = "bge"
    OPENAI = "openai"


EMBEDDING_DIMS = {
    EmbeddingModel.MINILM: 384,
    EmbeddingModel.BGE: 384,
    EmbeddingModel.OPENAI: 1536,
}


class EmbeddingRouter:
    def __init__(self, default_model: str):
        self._default = EmbeddingModel(default_model)

    @staticmethod
    def dimension_for(model: EmbeddingModel) -> int:
        return EMBEDDING_DIMS[model]

    @staticmethod
    @lru_cache(maxsize=3)
    def _load_st_model(model_name: str):
        from sentence_transformers import SentenceTransformer

        return SentenceTransformer(model_name)

    def _embed_openai(self, texts: list[str]) -> list[list[float]]:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not set for openai embeddings")
        import openai

        client = openai.OpenAI(api_key=settings.openai_api_key)
        response = client.embeddings.create(input=texts, model="text-embedding-3-small")
        return [item.embedding for item in response.data]

    def embed_texts(self, texts: list[str], model: EmbeddingModel | None = None) -> list[list[float]]:
        selected = model or self._default
        if selected == EmbeddingModel.OPENAI:
            return self._embed_openai(texts)
        if selected == EmbeddingModel.BGE:
            st_model = self._load_st_model("BAAI/bge-small-en-v1.5")
            return st_model.encode(texts, normalize_embeddings=True).tolist()

        st_model = self._load_st_model("sentence-transformers/all-MiniLM-L6-v2")
        return st_model.encode(texts, normalize_embeddings=True).tolist()

    def embed_query(self, query: str, model: EmbeddingModel | None = None) -> list[float]:
        return self.embed_texts([query], model=model)[0]

    def select_for_source(self, source_type: str, chunk_count: int) -> EmbeddingModel:
        if source_type in {"conversation_history_json", "transcript"}:
            return EmbeddingModel.MINILM
        if source_type == "pdf" and chunk_count > 50:
            return EmbeddingModel.BGE
        return self._default


embedding_router = EmbeddingRouter(settings.default_embedding_model)
