from __future__ import annotations

from typing import Any

from .client import DocuMindAPIClient
from .config import load_settings
from .service import DocuMindMCPService


def build_mcp_server():
    try:
        from fastmcp import FastMCP
    except ImportError as exc:
        raise RuntimeError(
            "fastmcp is required to run the MCP server. Install it with `pip install fastmcp`."
        ) from exc

    settings = load_settings()
    service = DocuMindMCPService(
        api_client=DocuMindAPIClient(settings.api_url),
        timeouts=settings.timeouts,
    )

    mcp = FastMCP(
        "DocuMind",
        instructions=(
            "Use DocuMind tools to search and query internal documentation. "
            "Prefer search_docs for lookup."
        ),
    )

    @mcp.tool()
    def search_docs(query: str, instance_id: str, namespace_id: str, top_k: int = 5) -> dict[str, Any]:
        """Search documentation with fast-first fallback behavior."""
        return service.search_docs(
            query=query,
            instance_id=instance_id,
            namespace_id=namespace_id,
            top_k=top_k,
        )

    return mcp


def run() -> None:
    build_mcp_server().run()


if __name__ == "__main__":
    run()
