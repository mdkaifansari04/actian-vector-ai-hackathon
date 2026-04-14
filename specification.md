# Specification Tracking Note

This repository currently keeps the detailed product specification in:

- `SPEC.md`

Implementation rule:

1. Treat `SPEC.md` as the full canonical spec content.
2. Keep this `specification.md` file updated as a quick implementation status pointer.
3. After each major phase/iteration, update both:
   - `SPEC.md` (requirements/details)
   - `agent-docs/tutu.md` (execution progress/context)

Last Synced: 2026-04-14
Current Active Prompt: `steps/step-one-prompt.md`
Current Active Reference: `agent-docs/tutu.md`

Latest Backend Status (Iteration 1):
- Class-based FastAPI Phase-1 foundation implemented in `documind/backend/app/`
- Working endpoints for instances, KBs, ingestion, search/query, memory, and observability
- Control-plane storage currently implemented with SQLite for speed
- Prisma schema added for planned PostgreSQL migration path
Latest Spec Update: Added embedding profile matrix in `SPEC.md` for general text, high-quality text, balanced text, multimodal (image+text), and code search model routing.
