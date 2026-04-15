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
            "Use search_docs first for factual lookup (counts, lists, exact values). "
            "Use ask_docs only for synthesis."
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

    @mcp.tool()
    def ask_docs(question: str, instance_id: str, namespace_id: str, top_k: int = 5) -> dict[str, Any]:
        """Use for synthesized grounded answers. Prefer search_docs for exact lookup/counting."""
        return service.ask_docs(
            question=question,
            instance_id=instance_id,
            namespace_id=namespace_id,
            top_k=top_k,
        )

    @mcp.tool()
    def ingest_text(content: str, instance_id: str, namespace_id: str, source_ref: str = "inline") -> dict[str, Any]:
        """Ingest plain text/markdown content into a target namespace."""
        return service.ingest_text(
            content=content,
            instance_id=instance_id,
            namespace_id=namespace_id,
            source_ref=source_ref,
        )

    @mcp.tool()
    def list_knowledge_bases(instance_id: str = "") -> dict[str, Any]:
        """List available knowledge bases, optionally scoped to one instance."""
        resolved_instance_id = instance_id.strip() or None
        return service.list_knowledge_bases(instance_id=resolved_instance_id)

    return mcp


def run() -> None:
    build_mcp_server().run()


if __name__ == "__main__":
    run()
