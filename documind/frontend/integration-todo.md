# Frontend Integration Todo (4 Phases)

> Based on `integration-standard.md` (Axios + TanStack Query + Zod + QueryWrapper).  
> Goal: complete integration fast with incremental progress tracking.

---

## Progress

- Overall: `25%` (1/4 phases done)
- Current phase: `Phase 2`
- Last updated: `2026-04-16`

---

## Phase 1: Data Access + Validation Foundation

- [x] Create `data-access/` structure:
  - [x] `data-access/data-types.ts`
  - [x] `data-access/interceptor.ts`
  - [x] Domain files (`instances.ts`, `knowledge-bases.ts`, `resources.ts`, `query.ts`, `system.ts`)
- [x] Add one Axios instance per backend domain with shared interceptor.
- [x] Define shared `ApiResponse<T>` and domain entity types.
- [x] Add/align `utils/validations.ts` with Zod schemas for all write payloads.
- [x] Ensure each data-access function returns unwrapped `data.body`.

Exit criteria:
- [x] No UI components directly call Axios/fetch.
- [x] Zod types are used by write functions.

---

## Phase 2: Query/Mutation Hooks + QueryWrapper

- [x] Create/standardize `hooks/queries.ts` for all read operations.
- [x] Create/standardize `hooks/mutations.ts` for all write operations.
- [x] Add stable query keys and `enabled` guards for dependent params.
- [x] Add/standardize `components/query-wrapper.tsx`.
- [ ] Update pages to consume hooks + `QueryWrapper` (no repeated loading/error branches).

Exit criteria:
- [x] Reads go through `useQuery` hooks only.
- [x] Writes go through `useMutation` hooks only.
- [ ] Loading/error/success rendering is consistent across pages.

---

## Phase 3: TanStack Router + Navigation Cutover (Incremental)

- [ ] Mount TanStack Router inside Next.js host route.
- [ ] Migrate routes incrementally:
  - [ ] Wave A: `/`, `/instances`, `/knowledge-bases`
  - [ ] Wave B: `/resources`, `/system`
  - [ ] Wave C: `/search`, `/ask`, `/chat`
- [ ] Add navigation adapters and update:
  - [ ] sidebar
  - [ ] top bar
  - [ ] command palette
- [ ] Keep route-by-route rollback switch while migrating.

Exit criteria:
- [ ] Migrated routes run through TanStack Router with parity.
- [ ] Non-migrated routes remain unaffected.

---

## Phase 4: Skeleton UX + Hardening + Cleanup

- [ ] Add reusable skeletons for table, two-panel, and chat layouts.
- [ ] Ensure skeleton styles match `STYLE.md` tokens (`bg-white/3`, `border-white/6`, existing radii).
- [ ] Add route error fallback and retry actions.
- [ ] Remove dead legacy calls and duplicate code paths.
- [ ] Final verification:
  - [ ] `npm run build`
  - [ ] `npm run lint`
  - [ ] smoke test all 8 routes
  - [ ] verify create/update flows and toasts

Exit criteria:
- [ ] All routes stable, styled, and using standard layers.
- [ ] No direct API calls inside page/components.

---

## Notes

- Mark each checkbox as work completes.
- If a task is skipped, add one-line reason below it.
- `bun run lint` is currently blocked because `eslint` is not installed in this project setup.
