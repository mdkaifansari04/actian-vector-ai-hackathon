from __future__ import annotations

import unittest

from pydantic import ValidationError

from app.models.schemas import (
    AdvancedQueryRequest,
    AdvancedSearchRequest,
    FilterClause,
    HybridConfig,
)


class AdvancedSchemaTests(unittest.TestCase):
    def test_advanced_search_defaults(self) -> None:
        body = AdvancedSearchRequest(instance_id="inst-1", query="deploy flow")
        self.assertEqual(body.namespace_id, "company_docs")
        self.assertEqual(body.mode, "semantic")
        self.assertEqual(body.top_k, 5)

    def test_hybrid_mode_requires_hybrid_config(self) -> None:
        with self.assertRaises(ValidationError):
            AdvancedSearchRequest(instance_id="inst-1", query="deploy flow", mode="hybrid")

    def test_hybrid_mode_accepts_hybrid_config(self) -> None:
        body = AdvancedSearchRequest(
            instance_id="inst-1",
            query="deploy flow",
            mode="hybrid",
            hybrid=HybridConfig(method="rrf", dense_weight=0.7, keyword_weight=0.3),
        )
        self.assertEqual(body.mode, "hybrid")
        self.assertIsNotNone(body.hybrid)
        self.assertEqual(body.hybrid.method, "rrf")

    def test_filter_clause_rejects_unknown_operator(self) -> None:
        with self.assertRaises(ValidationError):
            FilterClause(field="source_type", op="bad_op", value="text")

    def test_advanced_query_defaults(self) -> None:
        body = AdvancedQueryRequest(instance_id="inst-1", question="How do we deploy?")
        self.assertEqual(body.namespace_id, "company_docs")
        self.assertEqual(body.mode, "semantic")
        self.assertEqual(body.top_k, 5)


if __name__ == "__main__":
    unittest.main()
