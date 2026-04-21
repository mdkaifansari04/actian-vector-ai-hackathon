# DocuMind Video Recording Script (Main + DCLI + MCP + Agent Integration)

This is a single runbook for recording all submission videos with copy-paste commands and speaking prompts.

---

## 0) Pre-Flight Setup (Run Once Before Recording)

### 0.1 Terminals layout

Use 4 terminals:

- `T1` = Backend API
- `T2` = Frontend App
- `T3` = DCLI commands
- `T4` = MCP server (for Codex app connection)

### 0.2 Start backend (`T1`)

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
source .venv/bin/activate
export DOCUMIND_API_URL="http://localhost:8000"
uvicorn app.main:app --reload --port 8000
```

Expected:
- Backend starts on `http://localhost:8000`
- `/health` should respond.

### 0.3 Start frontend (`T2`)

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/frontend
export NEXT_PUBLIC_API_URL="http://localhost:8000"
bun run dev
```

Expected:
- Frontend on `http://localhost:3000`

### 0.4 Quick health check (`T3`)

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
./run_documind_cli.sh health
```

Expected:
- Health success message from backend.

### 0.5 Seed a small demo doc (`T3`)

```bash
cat > /tmp/documind-video-demo.md <<'EOF'
# Payments Service Runbook

Deployment:
1. Merge PR to main.
2. CI pipeline builds and pushes image.
3. Deploy to staging, validate health checks.
4. Promote to production.

Rollback:
- Re-deploy previous stable image tag.
- Verify /health and key payment endpoints.

Owner:
- Platform Engineering
EOF
```

---

## 1) Main Product Video Script (Overview + UI) [~3-4 min]

### Goal
Show complete product flow in UI:
- context -> ingest -> search/ask/chat -> system health.

### Recording steps

1. Open `http://localhost:3000/`.
2. Show navigation quickly: `/instances`, `/knowledge-bases`, `/resources`, `/search`, `/ask`, `/chat`, `/system`.
3. In `/resources`, ingest sample text or file.
4. In `/search`, run a query like `deployment steps`.
5. In `/ask`, ask `How do I rollback a bad deploy?`.
6. In `/chat`, ask one follow-up question and open source evidence panel.
7. In `/system`, show health + collections.

### Suggested voiceover

```text
DocuMind is a RAG system for private internal documentation.
We ingest docs once, index vectors in Actian VectorAI DB, and keep control-plane metadata in SQLite.
When users ask questions, we retrieve relevant chunks first, then generate grounded answers with sources.
The frontend exposes all key workflows: instances, KBs, resources, search, ask, chat, and system checks.
```

---

## 2) DCLI Video Script [~2-3 min]

### Goal
Show CLI-first power path end-to-end.

### Commands (`T3`)

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend

# Initialize active context (auto-select/create instance)
./run_documind_cli.sh init --namespace-id "hackathon_video"

# Show saved context
./run_documind_cli.sh context-show
./run_documind_cli.sh contexts

# Ingest demo file
./run_documind_cli.sh ingest-text \
  --content-file /tmp/documind-video-demo.md \
  --source-ref "video-demo-md"

# Search
./run_documind_cli.sh search-docs --qr "deployment steps" --top-k 5

# Ask grounded question
./run_documind_cli.sh ask-docs -qs "How do I rollback a bad deploy?" --top-k 5

# Show JSON mode for automation
./run_documind_cli.sh context-show --bot=true
```

### Suggested voiceover

```text
This is DCLI, our fast operator path.
It keeps active context, supports ingest/search/ask, and can output either human-readable or machine JSON mode.
This makes it practical for both developers and automation pipelines.
```

---

## 3) MCP Server + Codex App Video Script [~2-3 min]

### Goal
Show MCP tool surface connected to Codex app.

### 3.1 Start MCP server (`T4`)

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
export DOCUMIND_API_URL="http://localhost:8000"
./run_mcp_server.sh
```

### 3.2 Connect in Codex app

If Codex client needs JSON-style MCP config, use this shape:

```json
{
  "mcpServers": {
    "documind": {
      "command": "/Users/mdkaifansari04/code/projects/vector-ai/documind/backend/run_mcp_server.sh",
      "env": {
        "DOCUMIND_API_URL": "http://localhost:8000"
      }
    }
  }
}
```

If using Codex UI MCP settings, add the same command path + env vars there.

### 3.3 Prompt script inside Codex app

```text
Use DocuMind MCP tools only for this task.
1) list_instances
2) set_active_context using namespace_id="hackathon_video" (choose first instance_id if needed)
3) ingest_text with:
   content="Runbook note: emergency rollback uses previous stable image tag."
   source_ref="mcp-video-note"
4) search_docs query="rollback" top_k=5
5) ask_docs question="What is the rollback process?" top_k=5
Return tool outputs in order.
```

### Suggested voiceover

```text
The MCP server exposes DocuMind as tool calls to coding/assistant clients like Codex.
That means agents can ingest docs, search facts, and synthesize answers without custom glue code.
```

---

## 4) Agent Integration Video Script (CLI-first + Fallback) [~2-3 min]

### Goal
Show integration policy:
- agent tries DCLI first;
- on CLI failure/mismatch, fallback to MCP.

### 4.1 Prompt template for agent (Codex app)

```text
You have two execution paths to DocuMind:
Primary path: DCLI command execution
Fallback path: MCP tools

Policy:
- Always try DCLI first.
- If DCLI fails, times out, or returns invalid output, fallback to MCP and continue.
- For each step, print which path was used (DCLI or MCP).

Task:
1) Ensure context is set to namespace "agent_video_ns"
2) Ingest this text:
   "Agent integration test note: payment deploy uses CI pipeline and supports rollback."
3) Search docs for "payment deploy"
4) Ask docs: "How do we rollback deployment?"
5) Output final answer with sources.
```

### 4.2 Deterministic fallback demo (optional, recommended)

Use this if you want a guaranteed fallback moment during recording:

1. Intentionally run one failing DCLI call (bad API URL) in terminal:

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
DOCUMIND_API_URL="http://127.0.0.1:9999" ./run_documind_cli.sh search-docs --qr "rollback" --top-k 3
```

2. Then show the same operation succeeding via MCP in Codex app (from section 3.3).

### Suggested voiceover

```text
Our agent integration is reliability-first.
It uses DCLI as the fast path for user experience, and if CLI fails, it can continue through MCP.
This keeps agent workflows robust without losing momentum.
```

---

## 5) Backup Commands (Quick Recovery During Recording)

### Restart backend quickly

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
pkill -f "uvicorn app.main:app" || true
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Restart frontend quickly

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/frontend
pkill -f "next dev" || true
NEXT_PUBLIC_API_URL="http://localhost:8000" bun run dev
```

### Re-check core routes

```bash
for r in / /instances /knowledge-bases /resources /search /ask /chat /system; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000$r")
  echo "$r -> $code"
done
```

---

## 6) Final Speaking Pointers (Use in Main Submission Video)

Use these concise points:

1. Problem:
   - Internal docs are private, fragmented, and too large for raw LLM prompting.
2. Approach:
   - Ingest -> chunk -> embed -> retrieve -> grounded answer with sources.
3. Stack:
   - FastAPI core
   - Actian VectorAI for vectors
   - SQLite for control-plane metadata
   - OpenAI for embeddings + LLM refinement
   - DCLI + MCP integration surface
4. Reliability:
   - Instance/namespace-scoped context
   - CLI-first with MCP fallback for agent workflows
5. Outcome:
   - End-to-end system working across UI, CLI, and agent tool integration.

---

## 7) Video Output Checklist (Per Clip)

- [ ] 1080p recording
- [ ] Cursor size readable
- [ ] Terminal font large enough (>=16px equivalent)
- [ ] Commands pasted cleanly
- [ ] One clear success output shown
- [ ] Keep each clip focused on one story

