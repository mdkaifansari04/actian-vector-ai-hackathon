# Phase 2 Testing Runbook (MCP + Backend)

Date: 2026-04-15  
Mode: Hackathon (fast validation, not production hardening)

## Scope Covered

This runbook tests what is implemented in Phase 2 so far:
- `P2-T1` MCP server scaffold
- `P2-T2` `search_docs`
- `P2-T3` `ask_docs`
- `P2-T4` `ingest_text`, `list_knowledge_bases`
- `P2-T5` stable response envelope + error mapping

Not in this runbook yet:
- CLI wrapper (`P2-T6`) is not implemented yet.

---

## 1) Backend Setup

```bash
cd documind/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install fastmcp
uvicorn app.main:app --reload --port 8000
```

Keep this terminal running.

## 2) Seed Minimal Data (New Terminal)

```bash
cd documind/backend
source .venv/bin/activate
```

Create one instance:

```bash
curl -sS -X POST http://localhost:8000/instances \
  -H "Content-Type: application/json" \
  -d '{"name":"Hackathon Instance","description":"Phase 2 test"}'
```

Copy the returned `id` as `INSTANCE_ID`, then ingest two docs into namespace `company_docs`:

```bash
INSTANCE_ID="<paste-instance-id>"

curl -sS -X POST http://localhost:8000/resources \
  -H "Content-Type: application/json" \
  -d "{
    \"instance_id\":\"${INSTANCE_ID}\",
    \"namespace_id\":\"company_docs\",
    \"source_type\":\"text\",
    \"source_ref\":\"deploy.md\",
    \"content\":\"Deploy payments using: npm run deploy:payments. Rollback uses npm run rollback:payments.\"
  }"

curl -sS -X POST http://localhost:8000/resources \
  -H "Content-Type: application/json" \
  -d "{
    \"instance_id\":\"${INSTANCE_ID}\",
    \"namespace_id\":\"company_docs\",
    \"source_type\":\"text\",
    \"source_ref\":\"auth.md\",
    \"content\":\"Auth flow: browser -> API gateway -> auth service -> session token.\"
  }"
```

## 3) Direct API Smoke Tests

`/search/instance`:

```bash
curl -sS -X POST http://localhost:8000/search/instance \
  -H "Content-Type: application/json" \
  -d "{
    \"instance_id\":\"${INSTANCE_ID}\",
    \"namespace_id\":\"company_docs\",
    \"query\":\"how to deploy payments\",
    \"top_k\":5
  }"
```

`/query/instance`:

```bash
curl -sS -X POST http://localhost:8000/query/instance \
  -H "Content-Type: application/json" \
  -d "{
    \"instance_id\":\"${INSTANCE_ID}\",
    \"namespace_id\":\"company_docs\",
    \"question\":\"What is the deploy command?\",
    \"top_k\":5
  }"
```

Expected: answer + non-empty `sources`.

## 4) MCP Unit + Regression Tests

From `documind/backend`:

```bash
source .venv/bin/activate
python -m unittest tests/test_mcp_search_tool.py -v
python -m unittest discover -s tests -v
```

Expected: all tests pass.

## 5) Start MCP Server

From `documind/backend`:

```bash
source .venv/bin/activate
export DOCUMIND_API_URL="http://localhost:8000"
python -m mcp_server.server
```

Keep this terminal running.

## 6) MCP Client Connection (Codex / Claude Code / OpenCode)

Add an MCP server entry in your client config equivalent to:

```json
{
  "mcpServers": {
    "documind": {
      "command": "/ABS/PATH/vector-ai/documind/backend/.venv/bin/python",
      "args": ["-m", "mcp_server.server"],
      "env": {
        "DOCUMIND_API_URL": "http://localhost:8000"
      }
    }
  }
}
```

Notes:
- Replace `/ABS/PATH/...` with your real absolute path.
- If your client supports only `command + args`, keep the same split.
- If your client has a UI for MCP servers, use the same values there.

### Codex "Connect to a custom MCP" (recommended values)

Use this to avoid fragile wrapped command paths:

- Name: `documind`
- Type: `STDIO`
- Command to launch: `/Users/mdkaifansari04/code/projects/vector-ai/documind/backend/run_mcp_server.sh`
- Arguments: none
- Environment variables:
  - `DOCUMIND_API_URL` = `http://localhost:8000`
- Working directory: `/Users/mdkaifansari04/code/projects/vector-ai/documind/backend`

Important:
- Command path must be one continuous path (no spaces/newlines inside it).
- If you previously saved a broken entry, remove/uninstall it first, then add again.

## 7) Agent-Level MCP Test Prompts

Run these prompts in Codex/Claude Code/OpenCode after connecting:

1. `Call list_knowledge_bases for instance_id <INSTANCE_ID>.`
2. `Call search_docs for query "deploy payments", instance_id <INSTANCE_ID>, namespace_id company_docs, top_k 5.`
3. `Call ask_docs for question "What is the deploy command?", instance_id <INSTANCE_ID>, namespace_id company_docs.`
4. `Call ingest_text with source_ref "hotfix.md" and content "Hotfix command is npm run hotfix". Then ask_docs: "What is the hotfix command?"`
5. `Call search_docs with namespace_id does-not-exist and verify structured error response.`
6. `Call search_docs with top_k 100 and verify meta.top_k is capped at 20.`

## 8) What to Verify in Responses

For every tool response, validate envelope shape:

```json
{
  "status": "success|error",
  "data": {},
  "meta": {},
  "text": "optional"
}
```

For errors, verify `meta.error` is one of:
- `not_found`
- `validation_error`
- `timeout`
- `server_error`

For fallback checks:
- `search_docs`: empty primary result should set `meta.fallback_used=true` and `meta.path=/search/advanced`.
- `ask_docs`: weak/empty primary answer should set `meta.fallback_used=true` and `meta.path=/query/advanced`.

## 9) Feedback Template (Copy/Paste)

```md
## Phase 2 Feedback

- Client used: (Codex / Claude Code / OpenCode)
- MCP connection: PASS/FAIL
- list_knowledge_bases: PASS/FAIL
- search_docs: PASS/FAIL
- ask_docs: PASS/FAIL
- ingest_text: PASS/FAIL
- Error envelope consistency: PASS/FAIL
- Fallback behavior (search/ask): PASS/FAIL
- Notes:
  - 
  - 
```
