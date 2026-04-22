from __future__ import annotations

from collections.abc import Sequence
from typing import Any

from actian_vectorai import Distance, HnswConfigDiff, PointStruct, VectorAIClient, VectorParams

from app.config import settings


class VectorDBClient:
    DISTANCE_MAP = {
        "cosine": Distance.Cosine,
        "euclid": Distance.Euclid,
        "dot": Distance.Dot,
    }

    def __init__(self, url: str | None = None):
        self._url = url or settings.vectordb_url

    def _client(self) -> VectorAIClient:
        grpc_options = [
            ("grpc.keepalive_time_ms", settings.vectordb_keepalive_time_ms),
            ("grpc.keepalive_timeout_ms", settings.vectordb_keepalive_timeout_ms),
            (
                "grpc.keepalive_permit_without_calls",
                int(settings.vectordb_keepalive_permit_without_calls),
            ),
            ("grpc.http2.max_pings_without_data", settings.vectordb_max_pings_without_data),
        ]
        return VectorAIClient(self._url, grpc_options=grpc_options)

    @staticmethod
    def _ensure_collection_open(client: VectorAIClient, name: str) -> bool:
        if client.collections.exists(name):
            return True

        listed = client.collections.list()
        if name not in listed:
            return False

        vde = getattr(client, "vde", None)
        if not vde or not hasattr(vde, "open_collection"):
            return False

        vde.open_collection(name)
        return client.collections.exists(name)

    def health_check(self) -> dict[str, Any]:
        with self._client() as client:
            return client.health_check()

    def collection_exists(self, name: str) -> bool:
        with self._client() as client:
            return self._ensure_collection_open(client, name)

    def list_collections(self) -> list[str]:
        with self._client() as client:
            return client.collections.list()

    def create_collection(self, name: str, dim: int, distance: str = "cosine") -> None:
        metric = self.DISTANCE_MAP.get(distance, Distance.Cosine)
        with self._client() as client:
            if self._ensure_collection_open(client, name):
                return
            client.collections.create(
                name,
                vectors_config=VectorParams(size=dim, distance=metric),
                hnsw_config=HnswConfigDiff(m=16, ef_construct=200),
            )

    def delete_collection(self, name: str) -> None:
        with self._client() as client:
            if self._ensure_collection_open(client, name):
                client.collections.delete(name)

    def upsert_points(self, collection_name: str, points: Sequence[PointStruct]) -> None:
        if not points:
            return
        with self._client() as client:
            self._ensure_collection_open(client, collection_name)
            client.points.upsert(collection_name, list(points))

    def search(self, collection_name: str, vector: list[float], top_k: int = 5, filters: Any = None) -> list[Any]:
        with self._client() as client:
            self._ensure_collection_open(client, collection_name)
            return client.points.search(
                collection_name,
                vector=vector,
                limit=top_k,
                filter=filters,
            )

    def scroll_points(
        self,
        collection_name: str,
        *,
        limit: int = 100,
        offset: int | str | None = None,
        filters: Any = None,
    ) -> tuple[list[Any], int | str | None]:
        with self._client() as client:
            self._ensure_collection_open(client, collection_name)
            return client.points.scroll(
                collection_name,
                limit=limit,
                offset=offset,
                filter=filters,
                with_payload=True,
                with_vectors=False,
            )

    def count_points(self, collection_name: str) -> int:
        with self._client() as client:
            self._ensure_collection_open(client, collection_name)
            return client.points.count(collection_name)


vectordb = VectorDBClient()
