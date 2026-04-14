from __future__ import annotations

import unittest

from app.embeddings import EmbeddingModel, EmbeddingProfile, embedding_router
from app.routing import LLMProfile, RoutingService


class EmbeddingProfileTests(unittest.TestCase):
    def test_profile_maps_to_expected_model(self) -> None:
        self.assertEqual(
            embedding_router.model_for_profile(EmbeddingProfile.GENERAL_TEXT_SEARCH),
            EmbeddingModel.MINILM,
        )
        self.assertEqual(
            embedding_router.model_for_profile(EmbeddingProfile.HIGHER_QUALITY_TEXT),
            EmbeddingModel.MPNET,
        )
        self.assertEqual(
            embedding_router.model_for_profile(EmbeddingProfile.BALANCED_TEXT),
            EmbeddingModel.BGE,
        )
        self.assertEqual(
            embedding_router.model_for_profile(EmbeddingProfile.MULTIMODAL_TEXT_IMAGE),
            EmbeddingModel.CLIP,
        )
        self.assertEqual(
            embedding_router.model_for_profile(EmbeddingProfile.CODE_SEARCH),
            EmbeddingModel.CODEBERT,
        )

    def test_model_maps_back_to_default_profile(self) -> None:
        self.assertEqual(
            embedding_router.default_profile_for_model(EmbeddingModel.MINILM),
            EmbeddingProfile.GENERAL_TEXT_SEARCH,
        )
        self.assertEqual(
            embedding_router.default_profile_for_model(EmbeddingModel.MPNET),
            EmbeddingProfile.HIGHER_QUALITY_TEXT,
        )
        self.assertEqual(
            embedding_router.default_profile_for_model(EmbeddingModel.BGE),
            EmbeddingProfile.BALANCED_TEXT,
        )
        self.assertEqual(
            embedding_router.default_profile_for_model(EmbeddingModel.CLIP),
            EmbeddingProfile.MULTIMODAL_TEXT_IMAGE,
        )
        self.assertEqual(
            embedding_router.default_profile_for_model(EmbeddingModel.CODEBERT),
            EmbeddingProfile.CODE_SEARCH,
        )

    def test_profile_dimension_is_model_dimension(self) -> None:
        self.assertEqual(
            embedding_router.dimension_for_profile(EmbeddingProfile.GENERAL_TEXT_SEARCH),
            embedding_router.dimension_for(EmbeddingModel.MINILM),
        )
        self.assertEqual(
            embedding_router.dimension_for_profile(EmbeddingProfile.HIGHER_QUALITY_TEXT),
            embedding_router.dimension_for(EmbeddingModel.MPNET),
        )
        self.assertEqual(
            embedding_router.dimension_for_profile(EmbeddingProfile.BALANCED_TEXT),
            embedding_router.dimension_for(EmbeddingModel.BGE),
        )


class RoutingServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.routing = RoutingService()

    def test_source_type_code_defaults_to_code_search(self) -> None:
        profile = self.routing.recommend_embedding_profile(source_type="code")
        self.assertEqual(profile, EmbeddingProfile.CODE_SEARCH)

    def test_source_type_pdf_defaults_to_balanced_text(self) -> None:
        profile = self.routing.recommend_embedding_profile(source_type="pdf")
        self.assertEqual(profile, EmbeddingProfile.BALANCED_TEXT)

    def test_source_type_image_defaults_to_multimodal(self) -> None:
        profile = self.routing.recommend_embedding_profile(source_type="image")
        self.assertEqual(profile, EmbeddingProfile.MULTIMODAL_TEXT_IMAGE)

    def test_conversation_defaults_to_general_text(self) -> None:
        profile = self.routing.recommend_embedding_profile(source_type="conversation_history_json")
        self.assertEqual(profile, EmbeddingProfile.GENERAL_TEXT_SEARCH)

    def test_llm_profile_fast_for_short_query(self) -> None:
        profile = self.routing.recommend_llm_profile(question="status?")
        self.assertEqual(profile, LLMProfile.FAST)

    def test_llm_profile_quality_for_long_complex_query(self) -> None:
        question = "Explain architecture, tradeoffs, and migration plan in detail for our retrieval stack."
        profile = self.routing.recommend_llm_profile(question=question, retrieved_source_count=10)
        self.assertEqual(profile, LLMProfile.QUALITY)


if __name__ == "__main__":
    unittest.main()
