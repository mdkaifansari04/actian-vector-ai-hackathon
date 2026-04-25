# CLAUDE.md

Last updated: 2026-04-25

Project memory for Claude-based agents.

## Load Order
1. `AGENTS.md` (global repo contract)
2. `TODOS.md` (active execution queue)
3. `DECISIONS.md` (architectural constraints)
4. Nearest subtree `AGENTS.md` for files you touch

## Working Rules
- Follow `docs/agent/agent-workflow.md` for execution lifecycle.
- Run `./scripts/check-doc-contracts.sh` when touching contract docs.
- Keep summaries concrete: files changed, checks run, outcomes.
- If `SPEC.md` and implementation diverge, update docs or log a decision in `DECISIONS.md`.
