from __future__ import annotations

from enum import Enum
from functools import lru_cache

from app.config import settings


class EmbeddingModel(str, Enum):
    MINILM = "minilm"
    MPNET = "mpnet"
    BGE = "bge"
    OPENAI = "openai"
    CLIP = "clip"
    CODEBERT = "codebert"


class EmbeddingProfile(str, Enum):
    GENERAL_TEXT_SEARCH = "general_text_search"
    HIGHER_QUALITY_TEXT = "higher_quality_text"
    BALANCED_TEXT = "balanced_text"
    MULTIMODAL_TEXT_IMAGE = "multimodal_text_image"
    CODE_SEARCH = "code_search"


EMBEDDING_DIMS = {
    EmbeddingModel.MINILM: 384,
    EmbeddingModel.MPNET: 768,
    EmbeddingModel.BGE: 384,
    EmbeddingModel.OPENAI: 1536,
    EmbeddingModel.CLIP: 512,
    EmbeddingModel.CODEBERT: 768,
}


PROFILE_TO_MODEL: dict[EmbeddingProfile, EmbeddingModel] = {
    EmbeddingProfile.GENERAL_TEXT_SEARCH: EmbeddingModel.MINILM,
    EmbeddingProfile.HIGHER_QUALITY_TEXT: EmbeddingModel.MPNET,
    EmbeddingProfile.BALANCED_TEXT: EmbeddingModel.BGE,
    EmbeddingProfile.MULTIMODAL_TEXT_IMAGE: EmbeddingModel.CLIP,
    EmbeddingProfile.CODE_SEARCH: EmbeddingModel.CODEBERT,
}


MODEL_TO_DEFAULT_PROFILE: dict[EmbeddingModel, EmbeddingProfile] = {
    EmbeddingModel.MINILM: EmbeddingProfile.GENERAL_TEXT_SEARCH,
    EmbeddingModel.MPNET: EmbeddingProfile.HIGHER_QUALITY_TEXT,
    EmbeddingModel.BGE: EmbeddingProfile.BALANCED_TEXT,
    EmbeddingModel.OPENAI: EmbeddingProfile.BALANCED_TEXT,
    EmbeddingModel.CLIP: EmbeddingProfile.MULTIMODAL_TEXT_IMAGE,
    EmbeddingModel.CODEBERT: EmbeddingProfile.CODE_SEARCH,
}


SENTENCE_TRANSFORMER_NAMES: dict[EmbeddingModel, str] = {
    EmbeddingModel.MINILM: "sentence-transformers/all-MiniLM-L6-v2",
    EmbeddingModel.MPNET: "sentence-transformers/all-mpnet-base-v2",
    EmbeddingModel.BGE: "BAAI/bge-small-en-v1.5",
}


HUGGINGFACE_MODEL_NAMES: dict[EmbeddingModel, str] = {
    EmbeddingModel.CLIP: "openai/clip-vit-base-patch32",
    EmbeddingModel.CODEBERT: "microsoft/codebert-base",
}


class EmbeddingRouter:
    def __init__(self, default_model: str):
        self._default = EmbeddingModel(default_model)

    @staticmethod
    def dimension_for(model: EmbeddingModel) -> int:
        return EMBEDDING_DIMS[model]

    @staticmethod
    def dimension_for_profile(profile: EmbeddingProfile) -> int:
        return EMBEDDING_DIMS[PROFILE_TO_MODEL[profile]]

    @staticmethod
    def model_for_profile(profile: EmbeddingProfile) -> EmbeddingModel:
        return PROFILE_TO_MODEL[profile]

    @staticmethod
    def default_profile_for_model(model: EmbeddingModel) -> EmbeddingProfile:
        return MODEL_TO_DEFAULT_PROFILE[model]

    @staticmethod
    @lru_cache(maxsize=3)
    def _load_st_model(model_name: str):
        from sentence_transformers import SentenceTransformer

        return SentenceTransformer(model_name)

    @staticmethod
    @lru_cache(maxsize=2)
    def _load_codebert(model_name: str):
        from transformers import AutoModel, AutoTokenizer

        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name)
        model.eval()
        return tokenizer, model

    @staticmethod
    @lru_cache(maxsize=2)
    def _load_clip(model_name: str):
        from transformers import CLIPModel, CLIPTokenizerFast

        tokenizer = CLIPTokenizerFast.from_pretrained(model_name)
        model = CLIPModel.from_pretrained(model_name)
        model.eval()
        return tokenizer, model

    def _embed_openai(self, texts: list[str]) -> list[list[float]]:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not set for openai embeddings")
        import openai

        client = openai.OpenAI(api_key=settings.openai_api_key)
        response = client.embeddings.create(input=texts, model="text-embedding-3-small")
        return [item.embedding for item in response.data]

    def _embed_codebert(self, texts: list[str]) -> list[list[float]]:
        import torch

        tokenizer, model = self._load_codebert(HUGGINGFACE_MODEL_NAMES[EmbeddingModel.CODEBERT])
        encoded = tokenizer(texts, padding=True, truncation=True, max_length=512, return_tensors="pt")
        with torch.no_grad():
            output = model(**encoded)
            hidden = output.last_hidden_state
            mask = encoded["attention_mask"].unsqueeze(-1).to(hidden.dtype)
            pooled = (hidden * mask).sum(dim=1) / mask.sum(dim=1).clamp(min=1e-9)
            normalized = torch.nn.functional.normalize(pooled, p=2, dim=1)
        return normalized.cpu().tolist()

    def _embed_clip_text(self, texts: list[str]) -> list[list[float]]:
        import torch

        tokenizer, model = self._load_clip(HUGGINGFACE_MODEL_NAMES[EmbeddingModel.CLIP])
        encoded = tokenizer(texts, padding=True, truncation=True, max_length=77, return_tensors="pt")
        with torch.no_grad():
            features = model.get_text_features(**encoded)
            normalized = torch.nn.functional.normalize(features, p=2, dim=1)
        return normalized.cpu().tolist()

    def embed_texts(self, texts: list[str], model: EmbeddingModel | None = None) -> list[list[float]]:
        selected = model or self._default
        if selected == EmbeddingModel.OPENAI:
            return self._embed_openai(texts)
        if selected in SENTENCE_TRANSFORMER_NAMES:
            st_model = self._load_st_model(SENTENCE_TRANSFORMER_NAMES[selected])
            return st_model.encode(texts, normalize_embeddings=True).tolist()
        if selected == EmbeddingModel.CODEBERT:
            return self._embed_codebert(texts)
        if selected == EmbeddingModel.CLIP:
            return self._embed_clip_text(texts)

        raise ValueError(f"Unsupported embedding model: {selected}")

    def embed_query(self, query: str, model: EmbeddingModel | None = None) -> list[float]:
        return self.embed_texts([query], model=model)[0]

    def select_for_source(self, source_type: str, chunk_count: int) -> EmbeddingModel:
        if source_type in {"conversation_history_json", "transcript"}:
            return EmbeddingModel.MINILM
        if source_type == "pdf" and chunk_count > 50:
            return EmbeddingModel.BGE
        return self._default


embedding_router = EmbeddingRouter(settings.default_embedding_model)
