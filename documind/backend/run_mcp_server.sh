#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Default for local hackathon usage; can be overridden by caller.
export DOCUMIND_API_URL="${DOCUMIND_API_URL:-http://localhost:8000}"

exec "${SCRIPT_DIR}/.venv/bin/python" -m mcp_server.server
