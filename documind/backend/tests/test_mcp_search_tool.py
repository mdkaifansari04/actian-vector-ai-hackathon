from __future__ import annotations

import unittest

from mcp_server.service import DocuMindMCPService, MCPTimeouts


class FakeAPIClient:
    def __init__(self, responses):
        self._responses = list(responses)
        self.calls: list[tuple[str, dict, int]] = []

    def post_json(self, path: str, payload: dict, timeout_seconds: int) -> tuple[int, dict]:
        self.calls.append((path, payload, timeout_seconds))
        if not self._responses:
            raise AssertionError("No fake response left for call")
        return self._responses.pop(0)


class MCPToolSearchTests(unittest.TestCase):
    def setUp(self) -> None:
        self.timeouts = MCPTimeouts(search_seconds=8, ask_seconds=25, ingest_seconds=20)

    def test_search_docs_primary_success_caps_top_k_without_fallback(self) -> None:
        fake_client = FakeAPIClient(
            responses=[
                (
                    200,
                    {
                        "kb_id": "kb-1",
                        "results": [
                            {"id": 1, "text": "deploy runbook", "score": 0.91, "source_ref": "ops.md"},
                        ],
                    },
                ),
            ]
        )
        service = DocuMindMCPService(api_client=fake_client, timeouts=self.timeouts)

        result = service.search_docs(
            query="deployment flow",
            instance_id="inst-1",
            namespace_id="company_docs",
            top_k=100,
        )

        self.assertEqual(result["status"], "success")
        self.assertEqual(len(fake_client.calls), 1)

        path, payload, timeout = fake_client.calls[0]
        self.assertEqual(path, "/search/instance")
        self.assertEqual(payload["top_k"], 20)
        self.assertEqual(timeout, 8)

        self.assertFalse(result["meta"]["fallback_used"])
        self.assertEqual(len(result["data"]["results"]), 1)

    def test_search_docs_uses_advanced_fallback_when_primary_is_empty(self) -> None:
        fake_client = FakeAPIClient(
            responses=[
                (200, {"kb_id": "kb-1", "results": []}),
                (
                    200,
                    {
                        "mode": "hybrid",
                        "results": [
                            {"id": 11, "text": "fallback hit", "score": 0.76, "source_ref": "guide.md"},
                        ],
                    },
                ),
            ]
        )
        service = DocuMindMCPService(api_client=fake_client, timeouts=self.timeouts)

        result = service.search_docs(
            query="payment deploy",
            instance_id="inst-1",
            namespace_id="company_docs",
            top_k=5,
        )

        self.assertEqual(result["status"], "success")
        self.assertEqual(len(fake_client.calls), 2)

        first_path, _, _ = fake_client.calls[0]
        second_path, second_payload, _ = fake_client.calls[1]
        self.assertEqual(first_path, "/search/instance")
        self.assertEqual(second_path, "/search/advanced")
        self.assertEqual(second_payload["mode"], "hybrid")
        self.assertEqual(second_payload["hybrid"]["method"], "rrf")
        self.assertTrue(result["meta"]["fallback_used"])
        self.assertEqual(len(result["data"]["results"]), 1)

    def test_search_docs_not_found_error_mapping(self) -> None:
        fake_client = FakeAPIClient(
            responses=[
                (404, {"detail": "Knowledge base not found for instance_id + namespace_id"}),
            ]
        )
        service = DocuMindMCPService(api_client=fake_client, timeouts=self.timeouts)

        result = service.search_docs(
            query="x",
            instance_id="inst-1",
            namespace_id="company_docs",
        )

        self.assertEqual(result["status"], "error")
        self.assertEqual(result["meta"]["error"], "not_found")
        self.assertIn("not found", result["text"].lower())


if __name__ == "__main__":
    unittest.main()
