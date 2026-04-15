# DCLI Global Install + Codex Skill Integration

Date: 2026-04-15  
Goal: install `dcli` globally, test every command, and integrate `dcli` as a Codex CLI skill.

## 1) Behavior Model

- `dcli` default mode is human-readable terminal output.
- `--bot=true` returns structured JSON for agents.
- Backend API must be running (`DOCUMIND_API_URL`, default `http://localhost:8000`).
- `dcli` and `DCLI` are equivalent command names.

## 2) Global Install (pipx)

Install:

```bash
pipx install /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
```

Upgrade after local changes:

```bash
pipx reinstall documind-cli
hash -r
```

If package is not yet installed in pipx:

```bash
pipx install --force /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
hash -r
```

Verify:

```bash
which dcli
dcli -h
```

## 3) Start Backend

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
source .venv/bin/activate
python main.py
```

In another terminal:

```bash
export DOCUMIND_API_URL="http://localhost:8000"
```

## 4) Full Command Catalog

Global flags:
- `--api-url`
- `--context-id`

Per-command JSON mode flag:
- `--bot=true` or `--bot=false`

Commands and key flags:

| Command | Purpose | Key Flags |
| --- | --- | --- |
| `init` | Bootstrap saved context | `--instance-id`, `--instance-name`, `--instance-description`, `--namespace-id`, `--bot=true` |
| `context-show` | Show active context | `--bot=true` |
| `context-set` | Set active context | `--instance-id`, `--namespace-id`, `--bot=true` |
| `instances` | List instances | `--bot=true` |
| `instance-create` | Create instance | `--name`, `-d/--description`, `--bot=true` |
| `namespaces` | List namespaces | `--instance-id`, `--bot=true` |
| `list-kbs` | List knowledge bases | `--instance-id`, `--bot=true` |
| `search-docs` | Fast retrieval | `--qr/--query`, `--instance-id`, `--namespace-id`, `--top-k`, `--bot=true` |
| `ask-docs` | Grounded answer with sources | `-qs/--question`, `--instance-id`, `--namespace-id`, `--top-k`, `--bot=true` |
| `ingest-text` | Ingest inline/file content | `--content` or `--content-file`, `--source-ref`, `--instance-id`, `--namespace-id`, `--bot=true` |

## 5) First-Time Setup

Interactive (human) init:

```bash
dcli init
```

You will be prompted for `namespace_id` if omitted.

Non-interactive/agent init:

```bash
dcli init --namespace-id "company_docs" --bot=true
```

Verify context:

```bash
dcli context-show
dcli context-show --bot=true
```

## 6) Human-Mode Test Checklist

Run each command once without `--bot=true`.

1. Context

```bash
dcli context-show
dcli context-set --instance-id "<INSTANCE_ID>" --namespace-id "company_docs"
dcli context-show
```

2. Instance + namespace discovery

```bash
dcli instances
dcli namespaces --instance-id "<INSTANCE_ID>"
dcli list-kbs --instance-id "<INSTANCE_ID>"
```

3. Retrieval

```bash
dcli search-docs --qr "deploy command" --top-k 5
dcli ask-docs -qs "What is the deploy command?" --top-k 5
```

4. Ingestion

```bash
dcli ingest-text --source-ref "inline-test" --content "Hotfix command is npm run hotfix"
```

5. Create instance (optional)

```bash
dcli instance-create --name "My Test Instance" -d "manual validation"
```

## 7) Bot-Mode Test Checklist (JSON)

Run the same core flow with `--bot=true` to verify agent-compatible envelopes.

```bash
dcli context-show --bot=true
dcli instances --bot=true
dcli namespaces --instance-id "<INSTANCE_ID>" --bot=true
dcli list-kbs --instance-id "<INSTANCE_ID>" --bot=true
dcli search-docs --qr "deploy command" --top-k 5 --bot=true
dcli ask-docs -qs "What is the deploy command?" --top-k 5 --bot=true
dcli ingest-text --source-ref "bot-test" --content "sample content" --bot=true
```

Expected response shape:

```json
{
  "status": "success|error",
  "data": {},
  "meta": {},
  "text": "..."
}
```

## 8) Install `dcli` Skill Into Codex CLI

Source skill file:
- `/Users/mdkaifansari04/code/projects/vector-ai/docs/codex-skills/dcli/SKILL.md`

Install into Codex skills directory:

```bash
mkdir -p ~/.codex/skills/dcli-documind
cp /Users/mdkaifansari04/code/projects/vector-ai/docs/codex-skills/dcli/SKILL.md \
  ~/.codex/skills/dcli-documind/SKILL.md
```

Restart Codex CLI after copying.

## 9) Validate Skill in Codex CLI

Use prompts like these inside Codex:

1. `Use dcli-documind skill. Show my active DocuMind context in JSON.`
2. `Use dcli-documind skill. List all instances in JSON.`
3. `Use dcli-documind skill. Set context to instance <INSTANCE_ID> and namespace company_docs, then show context in JSON.`
4. `Use dcli-documind skill. Search docs for "deploy command" and return JSON.`
5. `Use dcli-documind skill. Ask docs "What is the deploy command?" and return JSON.`
6. `Use dcli-documind skill. Ingest this text into company_docs: "release process uses npm run release". Return JSON.`
7. `Use dcli-documind skill. Switch namespace to ops for this instance and confirm with context-show JSON.`
8. `Use dcli-documind skill. List namespaces for <INSTANCE_ID> in JSON.`

Notes:
- Ask Codex explicitly to use `dcli-documind skill`.
- Ask for JSON explicitly so it uses `--bot=true`.

## 10) Troubleshooting

`dcli: command not found`
- run `pipx ensurepath`
- open a new shell
- run `pipx reinstall documind-cli`

`unrecognized arguments: --bot=true`
- binary is stale
- run `pipx reinstall documind-cli`
- verify with `dcli context-show -h` (should display `--bot [true|false]`)

`connection refused localhost:8000`
- backend is not running
- run `python main.py` in backend directory

`context_missing` or wrong namespace
- run `dcli context-show`
- run `dcli context-set --instance-id "<INSTANCE_ID>" --namespace-id "<NAMESPACE_ID>"`

Slow answer for `ask-docs`
- use `search-docs` first for factual lookups
- use `ask-docs` for synthesis questions

## 11) Final Verification Matrix

- [ ] `dcli -h` shows all commands
- [ ] `dcli context-show` is human-readable
- [ ] `dcli context-show --bot=true` is JSON
- [ ] `dcli init` prompts namespace in interactive mode
- [ ] `dcli init --namespace-id ... --bot=true` works in non-interactive mode
- [ ] `search-docs`, `ask-docs`, `ingest-text`, `instances`, `list-kbs`, `namespaces`, `context-set`, `context-show` all pass in human mode
- [ ] same commands pass in bot mode (`--bot=true`)
- [ ] Codex skill is installed from `docs/codex-skills/dcli/SKILL.md`
- [ ] Codex executes dcli workflows using the skill and returns JSON when requested
