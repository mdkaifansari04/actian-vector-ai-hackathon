# Frontend Integration Handoff (Current State)

This file summarizes what changed and how to test everything locally before continuing with the next phase.

## What Was Changed

### 1) Data-Access Layer Introduced (Axios + typed contracts)

Added:
- `data-access/data-types.ts`
- `data-access/interceptor.ts`
- `data-access/client.ts`
- `data-access/local.ts`
- `data-access/instances.ts`
- `data-access/knowledge-bases.ts`
- `data-access/resources.ts`
- `data-access/query.ts`
- `data-access/system.ts`

What it does:
- Centralizes API communication.
- Uses Axios instances + request interceptor.
- Uses shared `ApiResponse<T>` + typed entities/contracts.
- Keeps mock fallback behavior when `NEXT_PUBLIC_API_URL` is not set.

### 2) Validation Standardized (Zod source)

Added:
- `utils/validations.ts`

What it does:
- Central schemas/types for:
  - create instance
  - create knowledge base
  - ingest resource
  - search payload
  - ask payload

### 3) Query/Mutation Hooks Layer Added

Added:
- `hooks/queries.ts`
- `hooks/mutations.ts`

What it does:
- Central query keys.
- Read operations via query hooks.
- Write operations via mutation hooks.
- Cache invalidation moved to mutation layer.

### 4) Query Wrapper Component Added

Added:
- `components/query-wrapper.tsx`

Status:
- Created and ready.
- Not fully adopted on all pages yet.

### 5) Dashboard Pages Migrated Off Direct API Calls

Updated:
- `app/(dashboard)/page.tsx`
- `app/(dashboard)/instances/page.tsx`
- `app/(dashboard)/knowledge-bases/page.tsx`
- `app/(dashboard)/resources/page.tsx`
- `app/(dashboard)/search/page.tsx`
- `app/(dashboard)/ask/page.tsx`
- `app/(dashboard)/chat/page.tsx`
- `app/(dashboard)/system/page.tsx`

Also updated supporting components:
- `components/context-switcher.tsx`
- `components/dialogs/create-instance-dialog.tsx`
- `components/dialogs/create-kb-dialog.tsx`
- `components/sheets/instance-detail-sheet.tsx`

### 6) Compatibility Layer Kept

Updated:
- `lib/api.ts`
- `lib/types.ts`

What it does:
- Preserves old import surface while routing to new data-access modules.

### 7) Tracker Updated

Updated:
- `integration-todo.md`

Status now:
- Phase 1 complete
- Phase 2 mostly complete
- Phase 3 deferred by decision (Next.js App Router retained)
- Phase 4 in progress (skeleton/error hardening shipped; manual create/update toast flow checks pending)

---

## Local Test Runbook

## Prerequisites

- Run backend locally and keep it running.
- In frontend env, set:
  - `NEXT_PUBLIC_API_URL=http://<your-backend-host>:<port>`
- Use Node/Bun compatible with Next.js 16.

## Install + Run

From `documind/frontend`:

```bash
bun install
bun run dev
```

App should be available on the Next.js local port (usually `http://localhost:3000`).

## Type/Build Validation

From `documind/frontend`:

```bash
bunx tsc --noEmit
bun run build
```

Expected:
- TypeScript check passes.
- Build succeeds.

Note:
- `bun run lint` currently fails because `eslint` is not installed in this project setup.

---

## Manual Smoke Checklist

## Global

- [ ] Open `/` and verify dashboard loads.
- [ ] Top bar context switcher works.
- [ ] Sidebar navigation works for all routes.

## Instances (`/instances`)

- [ ] List loads.
- [ ] Search/filter works.
- [ ] "Create Instance" works and list updates.
- [ ] "Set Active" updates context.

## Knowledge Bases (`/knowledge-bases`)

- [ ] List loads.
- [ ] Instance/namespace/status filters work.
- [ ] "Create Knowledge Base" works and list updates.

## Resources (`/resources`)

- [ ] Ingest text succeeds and shows success toast.
- [ ] Upload file succeeds and shows success toast.
- [ ] Resource list refreshes after ingest/upload.

## Search (`/search`)

- [ ] Basic search works.
- [ ] Advanced search works (hybrid/filters).
- [ ] Results panel expand/collapse works.

## Ask (`/ask`)

- [ ] Basic ask works.
- [ ] Advanced ask works.
- [ ] Source expansion works.

## Chat (`/chat`)

- [ ] Select instance + namespace scope.
- [ ] Send message and receive assistant response.
- [ ] Source inspector opens and content expands.

## System (`/system`)

- [ ] Health card loads.
- [ ] Collections list loads.
- [ ] Refresh button updates state.

---

## Immediate Next Work

1. Continue Phase 4 hardening with low risk:
   - verify create/update flows and toasts in a live browser session (with backend running)
2. Optional consistency pass:
   - adopt `QueryWrapper` where loading/error branches are still duplicated.
3. Keep commit scope safe:
   - docs-only and non-breaking updates for hackathon packaging.

## Tomorrow Delivery Plan (Hackathon)

Primary tracker file:
- `hackathon-submission-checklist.md`

1. Product videos (one per core area)
   - record short walkthrough clips for: Overview, Instances, Knowledge Bases, Resources, Search, Ask, Chat, System.
   - keep each clip focused on one story and include outcome/state at end.

2. Docs update and packaging
   - update frontend README/runbook with latest Phase 4 status and known limitations (`eslint` missing, manual flow checks pending).
   - add a concise demo script/checklist for judges.

3. Deployment
   - deploy latest frontend build to target environment.
   - validate production URLs for all 8 routes after deploy.

4. Hackathon submission
   - finalize submission form assets: deployed URL, demo video links, architecture summary, and setup notes.
   - run a final pre-submit checklist pass before submission.
