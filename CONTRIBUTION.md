# Contribution Guide

Last updated: 2026-04-23

This project has multiple moving parts (backend API, frontend UI, CLI, MCP server).  
Keep contributions focused, testable, and easy to review.

## 1) Before you start

- Read the root [`README.md`](README.md) for current feature status and architecture.
- If your change affects backend behavior, also read:
  - `documind/backend/README.md`
  - `documind/backend/IMPLEMENTATION_TEST_GUIDE.md`
- If your change affects frontend behavior, review:
  - `documind/frontend/tomorrow.md`
  - `documind/frontend/integration-todo.md`

## 2) Setup

### Backend

```bash
cd documind/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd documind/frontend
bun install
NEXT_PUBLIC_API_URL=http://localhost:8000 bun run dev
```

### Vector DB dependency

```bash
cd actian-vectorAI-db-beta
docker compose up -d
```

## 3) Branch and commit conventions

- Use short, scoped branches:
  - `feat/<topic>`
  - `fix/<topic>`
  - `docs/<topic>`
- Keep commits atomic (one concern per commit).
- Prefer Conventional Commit prefixes:
  - `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `build:`
- Follow `docs/commit.md` for detailed commit hygiene.

## 4) Engineering expectations

- Do not mix unrelated refactors with feature/bugfix changes.
- Preserve instance-scoped contract (`instance_id + namespace_id`) unless a migration is explicitly planned.
- If you change API request/response shapes, update docs and any affected frontend/data-access types in the same PR.
- Do not commit secrets, local env files, or generated artifacts.

## 5) Verification checklist (before PR)

Run what applies to your change set.

### Backend

```bash
cd documind/backend
python -m unittest discover -s tests -v
```

If tests are environment-sensitive, run at least a smoke path:

1. `GET /health`
2. create instance + knowledge base
3. ingest resource
4. run search/query

### Frontend

```bash
cd documind/frontend
bun run build
```

Recommended manual smoke for touched pages:

- context switching
- create instance / create KB
- resource ingest/crawl
- search/ask/chat flows
- system page health + collections

### CLI / MCP (if touched)

```bash
cd documind/backend
source .venv/bin/activate
dcli context-show --bot=true
./run_mcp_server.sh
```

## 6) Pull request checklist

- Problem and scope are clear in PR description.
- Verification commands and outcomes are included.
- API or UX behavior changes are documented.
- Follow-up work and known limitations are called out explicitly.

Thanks for keeping changes precise and reviewable.
