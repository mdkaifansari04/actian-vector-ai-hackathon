from __future__ import annotations

import unittest

from mcp_server.server import _guard_unknown_namespace, _require_create_confirmation


class _FakeService:
    def __init__(self, namespace_result: dict):
        self.namespace_result = namespace_result
        self.calls: list[tuple[str, str]] = []

    def list_namespaces(self, *, instance_id: str, context_id: str) -> dict:
        self.calls.append((instance_id, context_id))
        return self.namespace_result


class MCPServerGuardTests(unittest.TestCase):
    def test_create_instance_requires_confirmation(self) -> None:
        denied = _require_create_confirmation(False)
        allowed = _require_create_confirmation(True)

        self.assertIsNotNone(denied)
        self.assertEqual(denied["status"], "error")
        self.assertEqual(denied["meta"]["reason"], "confirmation_required")
        self.assertIsNone(allowed)

    def test_unknown_namespace_denied_without_override(self) -> None:
        fake = _FakeService(
            {"status": "success", "data": {"namespaces": ["ops", "engineering"]}, "meta": {}, "text": "ok"}
        )

        result = _guard_unknown_namespace(
            fake,
            instance_id="inst-1",
            namespace_id="svelte-docs",
            context_id="demo-app",
            allow_unknown_namespace=False,
        )

        self.assertIsNotNone(result)
        self.assertEqual(result["status"], "error")
        self.assertEqual(result["meta"]["reason"], "namespace_unknown")
        self.assertEqual(result["meta"]["available_namespaces"], ["ops", "engineering"])
        self.assertEqual(fake.calls, [("inst-1", "demo-app")])

    def test_unknown_namespace_allowed_with_override(self) -> None:
        fake = _FakeService(
            {"status": "success", "data": {"namespaces": []}, "meta": {}, "text": "ok"}
        )

        result = _guard_unknown_namespace(
            fake,
            instance_id="inst-1",
            namespace_id="new-namespace",
            context_id="demo-app",
            allow_unknown_namespace=True,
        )

        self.assertIsNone(result)
        self.assertEqual(fake.calls, [])

    def test_known_namespace_passes(self) -> None:
        fake = _FakeService(
            {"status": "success", "data": {"namespaces": ["svelte-docs"]}, "meta": {}, "text": "ok"}
        )

        result = _guard_unknown_namespace(
            fake,
            instance_id="inst-1",
            namespace_id="svelte-docs",
            context_id="demo-app",
            allow_unknown_namespace=False,
        )

        self.assertIsNone(result)
        self.assertEqual(fake.calls, [("inst-1", "demo-app")])

    def test_namespace_guard_propagates_service_error(self) -> None:
        fake = _FakeService(
            {
                "status": "error",
                "data": {},
                "meta": {"error": "not_found"},
                "text": "instance missing",
            }
        )

        result = _guard_unknown_namespace(
            fake,
            instance_id="inst-missing",
            namespace_id="ops",
            context_id="demo-app",
            allow_unknown_namespace=False,
        )

        self.assertIsNotNone(result)
        self.assertEqual(result["status"], "error")
        self.assertEqual(result["meta"]["error"], "not_found")


if __name__ == "__main__":
    unittest.main()
