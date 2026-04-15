# DocuMind Frontend Super Prompt (Phase 3)

Use this when generating the full frontend with another AI tool.

Sources used for contract accuracy:
- `documind/backend/postman/collection-v2.json`
- backend routers + schemas in `documind/backend/app`

## Copy/Paste Prompt

```md
You are a senior product designer + staff frontend engineer.
Build a production-grade frontend for **DocuMind** using the existing backend APIs exactly as defined below.

## 0) High-Level Objective
Build a robust, dark-mode-first DocuMind app where a single user can:
- view full system state (instances, namespaces, knowledge bases, vector collections, resources)
- create instances
- create knowledge bases
- ingest resources
- run search and ask queries
- use a modern **chat workspace** with scope selection (instance, namespace, KB), including multi-select UX for future expansion

This is a frontend-only build. Do not modify backend API contracts.

## 1) Hard UI/UX Constraints
- No auth in this phase (single-user app)
- Dark mode only (no light mode)
- Primary accent color: `#F0D7FF`
- Use internal `shadcn/ui` components (or equivalent)
- Use `sm` size variant for all components that support size (`Button`, `Input`, `Textarea`, `Select`, `Badge`, `Tabs`, `Dialog`, etc.)
- Clean and modern, not flashy
- Smooth, subtle micro-animations
- Fully responsive (desktop first, mobile solid)

## 2) Tech Requirements
- React + TypeScript + Tailwind + shadcn/ui
- React Router (or equivalent route-based pages)
- TanStack Query for server state
- react-hook-form + zod for forms
- Typed API layer with shared types and runtime-safe parsing
- Toast system + inline form errors + page-level error boundaries

## 3) Navigation + Information Architecture
App shell:
- Left sidebar (collapsible)
- Top action bar
- Main page content

Sidebar pages:
1. Overview
2. Instances
3. Knowledge Bases
4. Resources
5. Search
6. Ask
7. Chat Workspace
8. Collections & System
9. API Playground (optional but recommended)

Top bar:
- Active context chip (instance name + namespace + optional KB)
- Quick context switcher
- Global command trigger (`Cmd/Ctrl + K`)
- Quick-create menu: Create Instance / Create KB / Add Resource

## 4) Context Model (Core App State)
Create a persistent context model:
- `activeInstanceId`
- `activeInstanceName`
- `activeNamespaceId`
- `activeKbId?`
- `lastUpdatedAt`

Store in `localStorage` under `documind.activeContext`.

If missing context:
- Show guided setup modal
- Step 1: choose instance (or create one)
- Step 2: choose namespace from that instance’s KBs (or create a KB to create namespace)
- Step 3: optional KB pick

Never silently proceed without context for scoped operations.

## 5) Future-Ready Scope Model for Chat + Query UX
Design for two scope modes:

A) `single_scope` (fully API-connected now)
- One instance + one namespace (+ optional one KB)
- Uses existing `/search/instance`, `/query/instance`, `/search/advanced`, `/query/advanced`

B) `multi_scope` (frontend-ready now, backend fan-out can be added later)
- Multi-select namespaces across all instances
- Optional multi-select KBs
- “All namespaces” quick action
- UI + state + request planner must be implemented
- If backend fan-out is not wired, show non-blocking banner: 
  - “Multi-scope orchestration is in preview mode; currently executing primary scope only.”

Important: still build full multi-select UX now.

## 6) Page Specs

### Page: Overview
Purpose:
- give user complete operational snapshot

Sections:
- KPI cards:
  - total instances
  - total KBs
  - total unique namespaces
  - total collections
  - optional total resources (from selected context)
- Health card from `/health`
- Recent KB table
- Recent resource activity (latest from selected context)
- Quick actions row

Behavior:
- data from `/instances`, `/knowledge-bases`, `/collections`, `/health`
- if empty system: show “Get Started” block with clear CTAs

---

### Page: Instances
Components:
- searchable/sortable table
- create instance dialog
- row detail drawer

Columns:
- name
- description
- created_at
- updated_at
- id (secondary/expandable)

Actions:
- set active instance
- open namespaces for this instance

---

### Page: Knowledge Bases
Components:
- filters: instance selector, namespace selector, search
- KB grid or table
- create KB dialog

Create KB form fields:
- instance_id (required)
- namespace_id (required)
- name (required)
- embedding_profile (optional)
- embedding_model (optional)
- llm_profile (optional)
- distance_metric (default cosine)

KB card/table fields:
- id
- name
- instance_id
- namespace_id
- collection_name
- embedding_model
- embedding_profile
- embedding_dim
- llm_profile
- distance_metric
- status
- created_at
- updated_at

---

### Page: Resources
Components:
- tabs:
  - ingest text/markdown (JSON)
  - upload file (multipart)
  - list resources

Ingest JSON fields:
- instance_id (prefilled from context)
- namespace_id (prefilled from context)
- source_type (`text`, `markdown`, `pdf`, etc.)
- content
- source_ref
- user_id (optional)
- session_id (optional)

Upload fields:
- instance_id
- namespace_id
- source_type
- file
- source_ref

Resources list columns:
- id
- knowledge_base_id
- source_type
- source_ref
- chunks_indexed
- status
- created_at
- updated_at

Badges:
- status: `processing | done | failed`

---

### Page: Search
Components:
- query input
- top_k control
- result cards/list
- advanced panel

Advanced panel fields:
- mode: `semantic` | `hybrid`
- hybrid.method: `rrf` | `dbsf`
- dense_weight
- keyword_weight
- filters builder:
  - must[]
  - must_not[]
  - each clause: field, op, value

Default path:
- call `/search/instance`

Advanced path:
- call `/search/advanced`

Result item UI:
- score badge
- source_ref
- namespace chip
- resource_id
- chunk_index
- expandable text preview

---

### Page: Ask
Components:
- question textarea
- top_k
- ask button
- answer panel
- citations/source cards
- response metadata row (`response_ms`, `llm_profile`)
- advanced query panel (same structure as search advanced)

Default path:
- `/query/instance`

Advanced path:
- `/query/advanced`

If answer is `I don't know.`:
- show neutral warning card
- keep citations visible
- show rephrase suggestions

---

### Page: Chat Workspace (Important)
This is a full chat UX page, not just one input field.

Layout:
- Left: scope rail
- Center: chat thread
- Bottom: sticky composer
- Right (optional): source inspector panel

Scope rail:
- Instance selector (single select)
- Namespace selector with multi-select
- KB selector with multi-select
- Toggle: “All namespaces”
- Toggle: “Use advanced retrieval”
- Save scope preset button

Chat thread:
- user/assistant bubbles
- citation pills per assistant message
- timestamp + scope used per message
- expandable source drawer per response

Composer:
- must be a `Textarea` (not single-line input)
- inside composer toolbar include:
  - namespace chips button
  - KB chips button
  - top_k quick control
  - advanced toggle
  - clear button
  - send button
- keyboard:
  - `Enter` = send
  - `Shift+Enter` = newline

Behavior:
- if one scope selected: execute real API call
- if no scope selected (no instance/namespace/KB): do not fail silently; open quick scope picker inline in composer
- if many scopes selected:
  - generate a query plan object in FE
  - execute currently supported strategy (single primary scope) or fan-out if implemented
  - always show clear banner about current execution mode

Message object (frontend):
- id
- role
- content
- createdAt
- scopeSnapshot
- responseMs?
- llmProfile?
- sources[]

---

### Page: Collections & System
Components:
- collections table
- linked KB metadata table
- health panel
- optional vector DB version panel

Data:
- `/collections`
- `/health`

Goal:
- user can inspect everything happening in DB/collections at a glance

## 7) Micro-Animations (Subtle)
- page enter: opacity 0->1 + translateY 8->0 in 180ms
- card hover: border tint + 1.5% scale max
- loading skeleton crossfade
- list/table row stagger reveal (35ms step)
- composer send pulse (short, subtle)

## 8) Accessibility + Quality
- keyboard navigable everywhere
- visible focus ring using `#F0D7FF`
- color contrast >= WCAG AA
- aria labels on icon buttons
- empty/loading/error/success states for every page
- never display raw stack traces

## 9) API Contracts + Examples (Use As Ground Truth)
Use these exact routes.

### 9.1 Health
`GET /health`

Response example:
```json
{
  "status": "ok",
  "vectordb": {
    "title": "Actian VectorAI DB",
    "version": "Actian VectorAI DB 1.0.0 / VDE 1.0.0"
  }
}
```

### 9.2 Create Instance
`POST /instances`

Request example:
```json
{
  "name": "Acme Corp",
  "description": "Manual QA instance"
}
```

### 9.2a List Instances
`GET /instances`

Response example:
```json
[
  {
    "id": "cb6fcfe4-1ea7-4c19-922c-35598ac76017",
    "name": "Kaif local",
    "description": "some quetsions for exams",
    "created_at": "2026-04-15T09:45:56.687274",
    "updated_at": "2026-04-15T09:45:56.687274"
  }
]
```

Response example:
```json
{
  "id": "cb6fcfe4-1ea7-4c19-922c-35598ac76017",
  "name": "Kaif local",
  "description": "some quetsions for exams",
  "created_at": "2026-04-15T09:45:56.687274",
  "updated_at": "2026-04-15T09:45:56.687274"
}
```

### 9.3 Create Knowledge Base
`POST /knowledge-bases`

Request example:
```json
{
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "name": "Engineering Docs"
}
```

### 9.3a List Knowledge Bases
`GET /knowledge-bases?instance_id=<optional>`

Response example:
```json
[
  {
    "id": "a1fd1213-e7c2-4ba6-a0a3-16263184f69e",
    "instance_id": "cb6fcfe4-1ea7-4c19-922c-35598ac76017",
    "name": "Semester 1 KB",
    "namespace_id": "semester 1",
    "collection_name": "kb_cb6fcfe4_a1fd1213",
    "embedding_model": "minilm",
    "embedding_dim": 384,
    "distance_metric": "cosine",
    "status": "active",
    "created_at": "2026-04-15T09:46:31.316415",
    "updated_at": "2026-04-15T09:46:31.316415",
    "embedding_profile": "general_text_search",
    "llm_profile": "balanced"
  }
]
```

Response example:
```json
{
  "id": "a462f351-ff40-47c9-9033-d998f98030a3",
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "name": "Engineering Docs",
  "namespace_id": "semester 1",
  "collection_name": "kb_50d832d6_a462f351",
  "embedding_model": "minilm",
  "embedding_dim": 384,
  "distance_metric": "cosine",
  "status": "active",
  "created_at": "2026-04-15T09:46:06.574883",
  "updated_at": "2026-04-15T09:46:06.574883",
  "embedding_profile": "general_text_search",
  "llm_profile": "balanced"
}
```

### 9.4 Ingest Resource (JSON, Instance Scope)
`POST /resources`

Request example:
```json
{
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "source_type": "text",
  "content": "Payments deploy flow: push main, CI builds image, release to prod.",
  "source_ref": "deploy-notes.txt",
  "user_id": "user_123",
  "session_id": "sess_001"
}
```

Response example:
```json
{
  "status": "success",
  "kb_id": "7fa0e32c-bd4f-42fc-9760-40aad3b9958f",
  "resource_id": "d76d1bca-3bb1-4ba3-ad3f-da0a60e7e1d0",
  "chunks_indexed": 1
}
```

### 9.5 Ingest Resource (JSON, Legacy KB Scope)
`POST /resources`

Request example:
```json
{
  "kb_id": "a462f351-ff40-47c9-9033-d998f98030a3",
  "source_type": "markdown",
  "content": "# Deploy Notes\\n1. Merge to main\\n2. Wait for CI\\n3. Release",
  "source_ref": "deploy-notes.md"
}
```

### 9.6 Ingest Resource (FormData)
`POST /resources` multipart/form-data

Response example:
```json
{
  "status": "success",
  "kb_id": "a1fd1213-e7c2-4ba6-a0a3-16263184f69e",
  "resource_id": "08ba4dfc-d5e9-4c30-aea3-aca15c659c4e",
  "chunks_indexed": 200
}
```

### 9.7 List Resources (Instance + Namespace)
`GET /resources?instance_id=<id>&namespace_id=<ns>`

Response example:
```json
[
  {
    "id": "d76d1bca-3bb1-4ba3-ad3f-da0a60e7e1d0",
    "knowledge_base_id": "7fa0e32c-bd4f-42fc-9760-40aad3b9958f",
    "source_type": "text",
    "source_ref": "deploy-notes.txt",
    "chunks_indexed": 1,
    "status": "done",
    "created_at": "2026-04-15T09:40:53.034182",
    "updated_at": "2026-04-15T09:40:53.452471"
  }
]
```

### 9.8 Search (Instance Scope)
`POST /search/instance`

Request example:
```json
{
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "query": "how do we deploy payments service",
  "top_k": 3
}
```

Response example:
```json
{
  "kb_id": "7fa0e32c-bd4f-42fc-9760-40aad3b9958f",
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "results": [
    {
      "id": 499165351754857458,
      "text": "Payments deploy flow: push main, CI builds image, release to prod.",
      "score": 0.6274244785308838,
      "source_ref": "deploy-notes.txt",
      "chunk_index": 0,
      "resource_id": "67ce2434-69da-46a4-8e3b-c3cbd9c43182",
      "namespace_id": "semester 1"
    }
  ]
}
```

### 9.9 Query/Ask (Instance Scope)
`POST /query/instance`

Request example:
```json
{
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "question": "How do we deploy the payments service?",
  "top_k": 3
}
```

Response example:
```json
{
  "kb_id": "7fa0e32c-bd4f-42fc-9760-40aad3b9958f",
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "answer": "You have subjects like computer networks, embedded systems, computer graphics, and compiler design, which totals four subjects.",
  "sources": [
    {
      "id": 415323607895132984,
      "text": "I have subjects like computer neworks, emebeded systesm, computer graphics and compiler design and more...",
      "score": 0.3497893214225769,
      "source_ref": "deploy-notes.txt",
      "chunk_index": 0,
      "resource_id": "d76d1bca-3bb1-4ba3-ad3f-da0a60e7e1d0",
      "namespace_id": "semester 1"
    }
  ],
  "response_ms": 1205,
  "llm_profile": "balanced"
}
```

### 9.10 Search Advanced
`POST /search/advanced`

Request example:
```json
{
  "instance_id": "50d832d6-2a01-45ce-9947-bbad59a3fe93",
  "namespace_id": "semester 1",
  "query": "deployment notes for user_123",
  "mode": "hybrid",
  "hybrid": {
    "method": "rrf",
    "dense_weight": 0.7,
    "keyword_weight": 0.3
  },
  "filters": {
    "must": [
      {"field": "source_type", "op": "any_of", "value": ["text", "markdown"]},
      {"field": "user_id", "op": "eq", "value": "user_123"}
    ]
  },
  "top_k": 5
}
```

### 9.11 Query Advanced
`POST /query/advanced`

Request example:
```json
{
  "instance_id": "cb6fcfe4-1ea7-4c19-922c-35598ac76017",
  "namespace_id": "semester 1",
  "question": "Summarize deployment constraints from docs.",
  "mode": "hybrid",
  "hybrid": {
    "method": "rrf",
    "dense_weight": 0.7,
    "keyword_weight": 0.3
  },
  "filters": {
    "must": [
      {"field": "source_type", "op": "any_of", "value": ["text", "markdown"]}
    ]
  },
  "top_k": 5
}
```

Response can include noisy extracted source text (example from Postman has PDF-object style chunks). Build UI that handles long noisy citations gracefully.

### 9.12 Collections + Linked KBs
`GET /collections`

Response example:
```json
{
  "collections": [
    "kb_1742a0f5_d9279404",
    "kb_50d832d6_7fa0e32c",
    "kb_50d832d6_a462f351"
  ],
  "knowledge_bases": [
    {
      "id": "a1fd1213-e7c2-4ba6-a0a3-16263184f69e",
      "instance_id": "cb6fcfe4-1ea7-4c19-922c-35598ac76017",
      "name": "Semester 1 KB",
      "namespace_id": "semester 1",
      "collection_name": "kb_cb6fcfe4_a1fd1213",
      "embedding_model": "minilm",
      "embedding_dim": 384,
      "distance_metric": "cosine",
      "status": "active",
      "created_at": "2026-04-15T09:46:31.316415",
      "updated_at": "2026-04-15T09:46:31.316415",
      "embedding_profile": "general_text_search",
      "llm_profile": "balanced"
    }
  ]
}
```

### 9.13 Legacy Compatibility Endpoints (Support in API Layer)
Keep these in the API client for backward compatibility screens/tools:
- `POST /search` (kb_id scoped)
- `POST /query` (kb_id scoped)
- `GET /resources?kb_id=<kb_id>`

Legacy search request example:
```json
{
  "kb_id": "a462f351-ff40-47c9-9033-d998f98030a3",
  "query": "how do we deploy payments service",
  "top_k": 3
}
```

Legacy query request example:
```json
{
  "kb_id": "a462f351-ff40-47c9-9033-d998f98030a3",
  "question": "How do we deploy the payments service?",
  "top_k": 3
}
```

## 10) Expected Error Cases To Design For
- `404` knowledge base not found for selected `instance_id + namespace_id`
- `422` validation errors (missing required fields)
- `400` invalid input configuration
- `500` ingest or retrieval failures

UX rule:
- Every error should tell user what to do next.
- Do not only show raw JSON.

## 11) Component Suggestions (shadcn)
Use these components heavily:
- `Sidebar`, `ScrollArea`, `Separator`
- `Card`, `Badge`, `Tooltip`
- `Dialog`, `Sheet`, `Popover`
- `Tabs`, `Accordion`, `Collapsible`
- `Table`, `DataTable` pattern
- `Textarea` for chat composer
- `Command` for global command palette
- `Skeleton`, `Progress`
- `Toast` / `Sonner`

All in `sm` size variants where supported.

## 12) Frontend Data Types (Generate)
Create strong TS types from API shapes:
- `Instance`
- `KnowledgeBase`
- `Resource`
- `SearchResult`
- `SearchInstanceResponse`
- `QueryInstanceResponse`
- `AdvancedSearchRequest`
- `AdvancedQueryRequest`
- `AppContext`
- `ChatMessage`
- `ChatScope`

## 13) Delivery Requirements
Return complete, runnable frontend code with:
- route pages
- reusable API client
- state management
- typed models
- polished UI
- all empty/loading/error states
- chat workspace with textarea + scope controls + bubble UI

Do not implement backend changes.
Do not change API contracts.
```

## Notes
- This prompt intentionally includes real payload examples from your Postman v2 collection so the generated UI maps to actual backend behavior.
- It also includes future-ready multi-namespace chat UX while preserving current single-scope API flow.
