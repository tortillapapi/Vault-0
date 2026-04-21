---
type: system-cheatsheet
title: OpenClaw CLI Cheatsheet
slug: oc-cli
source_path: /root/.claude/projects/-root/memory/reference_oc_cli_cheatsheet.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, cheatsheet, cli]
---

## Purpose
Quick-reference for OpenClaw CLI commands used by the CC orchestrator — messaging, agents, tasks, cron, and diagnostics.

## Contents

---
name: OC CLI cheatsheet for CC orchestrator
description: Complete quick-reference for all OpenClaw CLI commands CC uses — messaging, agents, tasks, cron, files. Avoids re-exploring the CLI each session.
type: reference
originSessionId: a238ce87-1da8-45a0-bbab-7159be6a51a6
---
# OpenClaw CLI — CC Orchestrator Cheatsheet

## Telegram Messaging (user chat ID: 1207164084)

### Send text
```bash
openclaw message send --channel telegram --target 1207164084 -m "text"
```

### Send file as downloadable document
```bash
openclaw message send --channel telegram --target 1207164084 -m "caption" --media /path/to/file --force-document
```

### Send with inline buttons
```bash
openclaw message send --channel telegram --target 1207164084 -m "text" --buttons '[[{"text":"Yes","callback_data":"yes"},{"text":"No","callback_data":"no"}]]'
```

### Edit a sent message
```bash
openclaw message edit --channel telegram --target 1207164084 --message-id <id> -m "new text"
```

### Delete a message
```bash
openclaw message delete --channel telegram --target 1207164084 --message-id <id>
```

### Send silently (no notification)
```bash
openclaw message send --channel telegram --target 1207164084 -m "text" --silent
```

### Always add `--json` to capture messageId for edits/deletes.

---

## Agent Execution (use sparingly — slow ~60s, locks sessions)

### Run agent turn (inference required)
```bash
openclaw agent --agent <id> --local --message "prompt" --json
```

### Available agents
- `main` — openai-codex/gpt-5.4 (default top-tier: complex coding, multi-file work; identity "Grunt" is legacy naming)
- `lead` — openai-codex/gpt-5.4 (complex tasks, `--thinking high`)
- `mid` — openai-codex/gpt-5.3-codex (medium tasks, `--thinking medium`)
- `grunt-eng` — opencode-go/glm-5.1 (grunt-level coding/engineering, 200k ctx)
- `grunt` — opencode-go/kimi-k2.5 (non-code grunt: log edits, doc updates, formatting, ingest prep; 256k ctx; sessionKey `agent:grunt:main`)
- `email-parser` — google/gemini-2.5-flash (email parsing only)

### NEVER use `openclaw agent --deliver` for simple message relay. Use `message send`.

---

## Task Delegation to OC

### Preferred method: task file + manual paste
1. Write spec to `/root/specs/<name>.md`
2. Write task prompt to `/root/tasks/<name>.txt`
3. Paste into OC TUI prefixed with `Execute this task now:`

### OC workspace: `/root/.openclaw/workspace/`
### CC workspace: `/root/`
### Always inline full context in task prompts (OC has no memory between tasks)

---

## Cron (scheduled jobs via gateway)
```bash
openclaw cron list
openclaw cron add --help
openclaw cron run <id>          # debug/test run
openclaw cron disable <id>
openclaw cron enable <id>
```

---

## Diagnostics
```bash
openclaw status --json          # health + channel status
openclaw health                 # gateway health
openclaw channels list          # connected channels + auth providers
openclaw agents list --json     # agent configs
openclaw tasks list             # background task state
openclaw doctor                 # health checks + fixes
```

---

## Capabilities (no-agent inference)
```bash
openclaw capability model --help   # text inference
openclaw capability image --help   # image gen/describe
openclaw capability tts --help     # text to speech
openclaw capability audio --help   # transcription
```

---

## Limitations (Telegram channel)
- `message read` — NOT supported for Telegram
- File sends: use `--force-document` to prevent Telegram compression
- Max message length: 4096 chars (Telegram limit) — split or send as file
