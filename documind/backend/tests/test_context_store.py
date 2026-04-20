from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from mcp_server.context_store import ActiveContextStore


class ActiveContextStoreTests(unittest.TestCase):
    def test_set_and_get_context(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store_path = Path(temp_dir) / "contexts.json"
            store = ActiveContextStore(str(store_path))

            saved = store.set(context_id="default", instance_id="inst-1", namespace_id="company_docs")
            loaded = store.get("default")

            self.assertEqual(saved.instance_id, "inst-1")
            self.assertIsNotNone(loaded)
            self.assertEqual(loaded.instance_id, "inst-1")
            self.assertEqual(loaded.namespace_id, "company_docs")

    def test_returns_none_when_context_missing(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store_path = Path(temp_dir) / "contexts.json"
            store = ActiveContextStore(str(store_path))
            self.assertIsNone(store.get("missing"))

    def test_list_returns_all_contexts_sorted_by_context_id(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store_path = Path(temp_dir) / "contexts.json"
            store = ActiveContextStore(str(store_path))
            store.set(context_id="zeta", instance_id="inst-z", namespace_id="ns-z")
            store.set(context_id="alpha", instance_id="inst-a", namespace_id="ns-a")

            rows = store.list()

            self.assertEqual([row.context_id for row in rows], ["alpha", "zeta"])
            self.assertEqual(rows[0].instance_id, "inst-a")
            self.assertEqual(rows[1].namespace_id, "ns-z")

    def test_delete_removes_existing_context(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store_path = Path(temp_dir) / "contexts.json"
            store = ActiveContextStore(str(store_path))
            store.set(context_id="default", instance_id="inst-1", namespace_id="company_docs")

            deleted = store.delete("default")

            self.assertTrue(deleted)
            self.assertIsNone(store.get("default"))

    def test_delete_returns_false_for_missing_context(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            store_path = Path(temp_dir) / "contexts.json"
            store = ActiveContextStore(str(store_path))

            deleted = store.delete("missing")

            self.assertFalse(deleted)


if __name__ == "__main__":
    unittest.main()
