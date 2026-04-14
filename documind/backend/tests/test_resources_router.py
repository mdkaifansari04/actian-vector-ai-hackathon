from __future__ import annotations

import io
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.embeddings import EmbeddingProfile
from app.routers.resources import router as resources_router


class ResourceRouterTests(unittest.TestCase):
    def _build_client(self, fake_container: SimpleNamespace) -> TestClient:
        app = FastAPI()
        app.include_router(resources_router)
        patcher = patch("app.routers.resources.container", fake_container)
        patcher.start()
        self.addCleanup(patcher.stop)
        return TestClient(app)

    def test_ingest_accepts_json_text_payload(self) -> None:
        fake_store = MagicMock()
        fake_store.get_knowledge_base.return_value = {
            "id": "kb-1",
            "instance_id": "inst-1",
            "namespace_id": "company_docs",
            "embedding_model": "minilm",
            "embedding_dim": 384,
            "collection_name": "kb_collection",
        }
        fake_store.create_resource.return_value = {"id": "res-1"}

        fake_ingestion = MagicMock()
        fake_ingestion.ingest.return_value = 1

        fake_container = SimpleNamespace(store=fake_store, ingestion=fake_ingestion)
        client = self._build_client(fake_container)

        response = client.post(
            "/resources",
            json={
                "kb_id": "kb-1",
                "source_type": "text",
                "content": "Hello from JSON text payload",
                "source_ref": "inline-text",
                "user_id": "user-1",
                "session_id": "sess-1",
            },
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "success")
        self.assertEqual(body["resource_id"], "res-1")
        self.assertEqual(body["chunks_indexed"], 1)

        fake_store.create_resource.assert_called_once()
        create_resource_kwargs = fake_store.create_resource.call_args.kwargs
        self.assertEqual(create_resource_kwargs["source_type"], "text")

        fake_ingestion.ingest.assert_called_once()
        ingest_kwargs = fake_ingestion.ingest.call_args.kwargs
        self.assertEqual(ingest_kwargs["source_type"], "text")
        self.assertEqual(ingest_kwargs["content"], "Hello from JSON text payload")

    def test_ingest_accepts_instance_namespace_without_kb_id(self) -> None:
        fake_store = MagicMock()
        fake_store.find_kb_by_namespace.return_value = {
            "id": "kb-1",
            "instance_id": "inst-1",
            "namespace_id": "company_docs",
            "embedding_model": "minilm",
            "embedding_dim": 384,
            "collection_name": "kb_collection",
        }
        fake_store.create_resource.return_value = {"id": "res-1"}

        fake_ingestion = MagicMock()
        fake_ingestion.ingest.return_value = 2

        fake_container = SimpleNamespace(store=fake_store, ingestion=fake_ingestion)
        client = self._build_client(fake_container)

        response = client.post(
            "/resources",
            json={
                "instance_id": "inst-1",
                "namespace_id": "company_docs",
                "source_type": "text",
                "content": "hello without kb id",
                "source_ref": "inline.txt",
            },
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "success")
        self.assertEqual(body["resource_id"], "res-1")
        self.assertEqual(body["chunks_indexed"], 2)
        self.assertEqual(body["kb_id"], "kb-1")

        fake_store.find_kb_by_namespace.assert_called_once_with("inst-1", "company_docs")
        fake_store.create_resource.assert_called_once()
        create_resource_kwargs = fake_store.create_resource.call_args.kwargs
        self.assertEqual(create_resource_kwargs["knowledge_base_id"], "kb-1")

    def test_list_resources_accepts_instance_namespace_without_kb_id(self) -> None:
        fake_store = MagicMock()
        fake_store.find_kb_by_namespace.return_value = {"id": "kb-1"}
        fake_store.list_resources.return_value = [{"id": "res-1", "knowledge_base_id": "kb-1", "status": "done"}]

        fake_container = SimpleNamespace(store=fake_store, ingestion=MagicMock())
        client = self._build_client(fake_container)

        response = client.get(
            "/resources",
            params={"instance_id": "inst-1", "namespace_id": "company_docs"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        fake_store.find_kb_by_namespace.assert_called_once_with("inst-1", "company_docs")
        fake_store.list_resources.assert_called_once_with("kb-1")

    def test_ingest_auto_creates_kb_when_missing_for_instance_namespace(self) -> None:
        fake_store = MagicMock()
        fake_store.find_kb_by_namespace.return_value = None
        fake_store.get_instance.return_value = {"id": "inst-1"}
        fake_store.create_knowledge_base.return_value = {
            "id": "kb-new",
            "instance_id": "inst-1",
            "namespace_id": "project_docs",
            "embedding_model": "minilm",
            "embedding_dim": 384,
            "collection_name": "kb_inst_kbnew",
        }
        fake_store.create_resource.return_value = {"id": "res-1"}

        fake_ingestion = MagicMock()
        fake_ingestion.ingest.return_value = 1

        fake_routing = MagicMock()
        fake_routing.recommend_embedding_profile.return_value = EmbeddingProfile.GENERAL_TEXT_SEARCH

        fake_vectordb = MagicMock()

        fake_container = SimpleNamespace(
            store=fake_store,
            ingestion=fake_ingestion,
            routing=fake_routing,
            vectordb=fake_vectordb,
        )
        client = self._build_client(fake_container)

        response = client.post(
            "/resources",
            json={
                "instance_id": "inst-1",
                "namespace_id": "project_docs",
                "source_type": "text",
                "content": "auto create kb path",
                "source_ref": "inline.txt",
            },
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "success")
        self.assertEqual(body["kb_id"], "kb-new")
        fake_store.create_knowledge_base.assert_called_once()
        fake_vectordb.create_collection.assert_called_once()

    def test_ingest_accepts_markdown_file_upload(self) -> None:
        fake_store = MagicMock()
        fake_store.get_knowledge_base.return_value = {
            "id": "kb-1",
            "instance_id": "inst-1",
            "namespace_id": "company_docs",
            "embedding_model": "minilm",
            "embedding_dim": 384,
            "collection_name": "kb_collection",
        }
        fake_store.create_resource.return_value = {"id": "res-1"}

        fake_ingestion = MagicMock()
        fake_ingestion.ingest.return_value = 1

        fake_container = SimpleNamespace(store=fake_store, ingestion=fake_ingestion)
        client = self._build_client(fake_container)

        response = client.post(
            "/resources",
            data={"kb_id": "kb-1", "source_type": "markdown", "source_ref": "notes.md"},
            files={"file": ("notes.md", io.BytesIO(b"# Heading\nhello markdown"), "text/markdown")},
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["status"], "success")
        self.assertEqual(body["resource_id"], "res-1")
        self.assertEqual(body["chunks_indexed"], 1)

        fake_ingestion.ingest.assert_called_once()
        ingest_kwargs = fake_ingestion.ingest.call_args.kwargs
        self.assertEqual(ingest_kwargs["source_type"], "markdown")
        self.assertEqual(ingest_kwargs["content"], "# Heading\nhello markdown")


if __name__ == "__main__":
    unittest.main()
