# DocuMind Master Diagram Prompt (Single Prompt for Eraser.io)

```text
Create one single comprehensive architecture + flow diagram for "DocuMind" (not sub-diagrams).
This should reflect the current implemented reality exactly.

Primary objective:
- Show complete user entry points, backend architecture, data layers, retrieval behavior, and CLI/MCP fallback behavior in one diagram.

Important corrections to enforce:
1) DCLI and MCP server use FastAPI routes/APIs under the hood.
2) Do NOT show DCLI or MCP as directly managing local context as a standalone architecture dependency.
3) FastAPI is the central system containing all core logic:
   - instances
   - resources
   - knowledge bases
   - query/search
   - observability
4) FastAPI connects internally to:
   - Actian VectorAI database (vectors/embeddings + semantic retrieval data)
   - SQLite (instance creation, KB creation, metadata, resource records, logs, etc.)
5) OpenAI is used for BOTH:
   - embedding generation
   - LLM response refinement/generation
6) Do NOT include alert/webhook architecture blocks (not implemented yet).
7) Retrieval behavior:
   - primary knowledge comes from stored context + vector database retrieval
   - if OpenAI is unavailable/not selected, return database-grounded response directly
   - if OpenAI is available, use LLM provider to produce refined response using retrieved context

Actors / entry points (left side):
- Web User
- Terminal User
- AI Agent User
- AI Agent Runtime (examples: Codex, Claude Code, OpenCode)

Client/entry systems:
- Next.js Web UI
- DCLI (documind_cli / dcli)
- MCP Server

Critical entry flow policy:
- AI Agent Runtime should try DCLI first for fast UX.
- If DCLI output is invalid/fails/mismatched, then fallback to MCP Server.
- MCP Server then calls FastAPI APIs to complete equivalent operation.

Backend (center, dominant block):
- FastAPI Backend (single central brain)
- Internal modules/routers:
  - instances
  - knowledge-bases
  - resources/ingestion
  - search/query
  - memory
  - observability
  - health/system
- Internal processing:
  - ingestion pipeline (parse -> chunk -> embed -> store)
  - retrieval pipeline (semantic/hybrid)
  - answer pipeline (DB-grounded answer vs OpenAI-refined answer based on provider availability)

Data/storage layer:
- SQLite
  - instances
  - knowledge bases
  - resource metadata
  - operational/query records
- Actian VectorAI DB
  - vectors for docs/memory
  - chunk embeddings + retrieval metadata

External provider layer:
- OpenAI Embeddings API
- OpenAI LLM API

Must include these complete user flows in the same diagram:

A) Web user flow
1. Web User -> Next.js UI
2. Next.js UI -> FastAPI APIs
3. FastAPI handles instance/KB/resource/chat/search/ask flows
4. FastAPI reads/writes SQLite + VectorAI as needed
5. FastAPI optionally calls OpenAI (embedding + LLM)
6. Response returned to Next.js UI

B) Terminal user flow
1. Terminal User -> DCLI command
2. DCLI -> FastAPI APIs
3. FastAPI executes logic and returns response
4. DCLI renders output (human/json modes)

C) AI agent flow (CLI-first fallback design)
1. AI Agent Runtime receives task
2. Agent -> DCLI (primary)
3. Decision: DCLI result valid?
   - yes: return result
   - no: Agent -> MCP Server
4. MCP Server -> FastAPI APIs
5. FastAPI returns result -> MCP -> Agent

D) Retrieval + response generation flow
1. Query enters FastAPI
2. FastAPI retrieves relevant context from VectorAI + supporting data from SQLite
3. Decision: OpenAI available/selected?
   - no: return grounded response directly from retrieved DB context
   - yes: send retrieved context to OpenAI LLM for refined response
4. Return final response with sources/context grounding

Visual requirements:
- One single coherent diagram.
- Left-to-right layout.
- Layered boundaries:
  1) Users
  2) Entry Clients
  3) FastAPI Core
  4) Data Stores
  5) External Providers
- Use decision diamonds for:
  - DCLI validity check (agent fallback)
  - OpenAI availability check (response mode selection)
- Distinguish primary vs fallback edges:
  - primary = solid line
  - fallback = dashed line
- Label edges with protocol/type:
  - CLI command
  - MCP tool/API call
  - HTTP/JSON
  - DB read/write
  - vector retrieval/upsert
  - OpenAI embedding/LLM call
- Keep names implementation-close and production-realistic.
- Avoid hypothetical components that are not implemented.
```
