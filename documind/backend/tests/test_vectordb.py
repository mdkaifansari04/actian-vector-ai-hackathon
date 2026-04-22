from __future__ import annotations

import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from app.vectordb import VectorDBClient


class _ClientContext:
    def __init__(self, client):
        self._client = client

    def __enter__(self):
        return self._client

    def __exit__(self, exc_type, exc, tb):
        return False


class VectorDBClientTests(unittest.TestCase):
    def test_search_opens_persisted_collection_when_exists_false(self) -> None:
        name = "kb_97536fe5_c9c44dac"
        collections = SimpleNamespace(
            exists=MagicMock(side_effect=[False, True]),
            list=MagicMock(return_value=[name]),
        )
        points = SimpleNamespace(search=MagicMock(return_value=[]))
        vde = SimpleNamespace(open_collection=MagicMock(return_value=True))
        fake_client = SimpleNamespace(collections=collections, points=points, vde=vde)
        db = VectorDBClient("localhost:50051")

        with patch.object(db, "_client", return_value=_ClientContext(fake_client)):
            db.search(name, vector=[0.1], top_k=1, filters=None)

        vde.open_collection.assert_called_once_with(name)
        points.search.assert_called_once()

    def test_create_collection_opens_persisted_collection_instead_of_recreate(self) -> None:
        name = "kb_97536fe5_c9c44dac"
        collections = SimpleNamespace(
            exists=MagicMock(side_effect=[False, True]),
            list=MagicMock(return_value=[name]),
            create=MagicMock(),
        )
        vde = SimpleNamespace(open_collection=MagicMock(return_value=True))
        fake_client = SimpleNamespace(collections=collections, vde=vde)
        db = VectorDBClient("localhost:50051")

        with patch.object(db, "_client", return_value=_ClientContext(fake_client)):
            db.create_collection(name=name, dim=384, distance="cosine")

        vde.open_collection.assert_called_once_with(name)
        collections.create.assert_not_called()


if __name__ == "__main__":
    unittest.main()
