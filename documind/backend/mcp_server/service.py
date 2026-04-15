from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import httpx


@dataclass(frozen=True)
class MCPTimeouts:
    search_seconds: int = 8
    ask_seconds: int = 25
    ingest_seconds: int = 20


class DocuMindMCPService:
    def __init__(self, *, api_client: Any, timeouts: MCPTimeouts | None = None):
        self._api_client = api_client
        self._timeouts = timeouts or MCPTimeouts()

    @staticmethod
    def _error(
        *,
        error: str,
        text: str,
        http_status: int | None = None,
        extra_meta: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        meta: dict[str, Any] = {"error": error}
        if http_status is not None:
            meta["http_status"] = http_status
        if extra_meta:
            meta.update(extra_meta)
        return {
            "status": "error",
            "data": {},
            "meta": meta,
            "text": text,
        }

    @staticmethod
    def _success(*, data: dict[str, Any], meta: dict[str, Any], text: str) -> dict[str, Any]:
        return {
            "status": "success",
            "data": data,
            "meta": meta,
            "text": text,
        }

    @staticmethod
    def _map_http_error(status_code: int) -> str:
        if status_code == 404:
            return "not_found"
        if status_code == 422:
            return "validation_error"
        if status_code in {408, 504}:
            return "timeout"
        return "server_error"

    @staticmethod
    def _top_k(value: int) -> int:
        return min(max(value, 1), 20)

    def search_docs(
        self,
        *,
        query: str,
        instance_id: str,
        namespace_id: str,
        top_k: int = 5,
    ) -> dict[str, Any]:
        if not query.strip() or not instance_id.strip() or not namespace_id.strip():
            return self._error(
                error="validation_error",
                text="query, instance_id, and namespace_id are required.",
            )

        resolved_top_k = self._top_k(top_k)
        primary_payload = {
            "instance_id": instance_id,
            "namespace_id": namespace_id,
            "query": query,
            "top_k": resolved_top_k,
        }

        try:
            primary_status, primary_data = self._api_client.post_json(
                "/search/instance",
                primary_payload,
                self._timeouts.search_seconds,
            )
        except httpx.TimeoutException:
            return self._error(error="timeout", text="search request timed out.")
        except Exception:
            return self._error(error="server_error", text="search request failed.")

        if primary_status != 200:
            mapped = self._map_http_error(primary_status)
            detail = str(primary_data.get("detail", "Search request failed"))
            return self._error(
                error=mapped,
                text=detail,
                http_status=primary_status,
                extra_meta={"fallback_used": False},
            )

        primary_results = primary_data.get("results", [])
        if primary_results:
            return self._success(
                data={"results": primary_results},
                meta={
                    "instance_id": instance_id,
                    "namespace_id": namespace_id,
                    "top_k": resolved_top_k,
                    "fallback_used": False,
                    "path": "/search/instance",
                },
                text=f"Found {len(primary_results)} result(s).",
            )

        fallback_payload = {
            "instance_id": instance_id,
            "namespace_id": namespace_id,
            "query": query,
            "top_k": resolved_top_k,
            "mode": "hybrid",
            "hybrid": {"method": "rrf", "dense_weight": 0.7, "keyword_weight": 0.3},
        }

        try:
            fallback_status, fallback_data = self._api_client.post_json(
                "/search/advanced",
                fallback_payload,
                self._timeouts.search_seconds,
            )
        except httpx.TimeoutException:
            return self._error(
                error="timeout",
                text="search fallback timed out.",
                extra_meta={"fallback_used": True},
            )
        except Exception:
            return self._error(
                error="server_error",
                text="search fallback failed.",
                extra_meta={"fallback_used": True},
            )

        if fallback_status != 200:
         
            mapped = self._map_http_error(fallback_status)
            detail = str(fallback_data.get("detail", "Search fallback failed"))
            return self._error(
                error=mapped,
                text=detail,
                http_status=fallback_status,
                extra_meta={"fallback_used": True},
            )

        fallback_results = fallback_data.get("results", [])
        return self._success(
            data={"results": fallback_results},
            meta={
                "instance_id": instance_id,
                "namespace_id": namespace_id,
                "top_k": resolved_top_k,
                "fallback_used": True,
                "path": "/search/advanced",
            },
            text=f"Found {len(fallback_results)} result(s) after fallback.",
        )
