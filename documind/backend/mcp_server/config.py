from __future__ import annotations

import os
from dataclasses import dataclass

from .service import MCPTimeouts


@dataclass(frozen=True)
class MCPServerSettings:
    api_url: str
    timeouts: MCPTimeouts


def load_settings() -> MCPServerSettings:
    return MCPServerSettings(
        api_url=os.getenv("DOCUMIND_API_URL", "http://localhost:8000"),
        timeouts=MCPTimeouts(
            search_seconds=int(os.getenv("DOCUMIND_SEARCH_TIMEOUT_SECONDS", "8")),
            ask_seconds=int(os.getenv("DOCUMIND_ASK_TIMEOUT_SECONDS", "25")),
            ingest_seconds=int(os.getenv("DOCUMIND_INGEST_TIMEOUT_SECONDS", "20")),
        ),
    )
