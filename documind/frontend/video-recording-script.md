# DCLI Testing Video Script

This file is intentionally minimal and only covers the DCLI testing video.

---

## 1) One-Time Setup (Before Recording)

### 1.1 Start backend (Terminal 1)

```bash
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
source .venv/bin/activate
export DOCUMIND_API_URL="http://localhost:8000"
uvicorn app.main:app --reload --port 8000
```

### 1.2 Install DCLI globally with pipx (Terminal 2)

```bash
pipx install /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
```

If already installed and you want latest local changes:

```bash
pipx reinstall documind-cli
```

### 1.3 Verify global CLI is available

```bash
dcli --help
```

### 1.4 Set API URL in your recording terminal

```bash
export DOCUMIND_API_URL="http://localhost:8000"
```

---

## 2) DCLI Video Flow (Copy/Paste Commands)

Run these in order while recording:

```bash
# 1) Check backend health
dcli health

# 2) Initialize active context (auto-select or create instance)
dcli init --namespace-id "hackathon_video"

# 3) Show active context and saved contexts
dcli context-show
dcli contexts

# 4) Create a small demo markdown file
cat > /tmp/documind-video-demo.md <<'EOF'
# Payments Service Runbook

Deployment:
1. Merge PR to main.
2. CI builds and pushes image.
3. Deploy to staging.
4. Promote to production.

Rollback:
- Re-deploy previous stable image tag.
EOF

# 5) Ingest demo content
dcli ingest-text --content-file /tmp/documind-video-demo.md --source-ref "video-demo-md"

# 6) Search
dcli search-docs --qr "deployment steps" --top-k 5

# 7) Ask grounded question
dcli ask-docs -qs "How do I rollback a bad deploy?" --top-k 5

# 8) Show bot mode JSON output
dcli context-show --bot=true
```

---

## 3) What To Say During The Video (Short Voiceover)

```text
This is DocuMind DCLI running as a global command.
I start by checking backend health, then initialize active context with instance and namespace.
Next, I ingest a markdown runbook, run semantic search, and ask a grounded question.
DCLI supports both human-readable output and JSON bot mode, so it works for both operators and automation workflows.
```

---

## 4) Backup Commands (If Something Fails Mid-Recording)

```bash
# Restart backend
cd /Users/mdkaifansari04/code/projects/vector-ai/documind/backend
pkill -f "uvicorn app.main:app" || true
source .venv/bin/activate
export DOCUMIND_API_URL="http://localhost:8000"
uvicorn app.main:app --reload --port 8000
```

```bash
# Reinstall global CLI
pipx reinstall documind-cli
```
