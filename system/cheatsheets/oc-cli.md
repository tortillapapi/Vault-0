---
type: system-cheatsheet
title: OpenClaw CLI Cheatsheet
slug: oc-cli
canonical_for: [openclaw-cli-syntax]
last_verified: 2026-08-10
maintainer: cc
tags: [ops, cheatsheet, cli]
---

## Purpose
Quick-reference for the `openclaw` CLI — messaging, agents, tasks, cron, diagnostics.
Applies to every orchestrator, not just CC. **Read this before any `openclaw` command**
(hard gate, per [[system/cheatsheets/operating-rules]]).

Which agent to dispatch to is **not** decided here — see
[[system/configs/openclaw-agents]].

# OpenClaw CLI — Cheatsheet

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
`--buttons` does not exist in the installed build (`2026.7.1-2`). Use `--presentation`
with a JSON `{title?, tone?, blocks: [...]}` shape — a malformed shape silently sends
with no buttons, no error. A `buttons` block's entries must set `value` only, never
`action` — `action:{type:"callback"}` is silently dropped unless a plugin claims it;
only the deprecated top-level `value` reaches the agent as a synthetic inbound message.
`value` is capped at 64 bytes (over-limit buttons are silently removed) and must not
start with `/` (that routes into the command parser instead).
```bash
openclaw message send --channel telegram --target 1207164084 \
  -m "text" \
  --presentation '{"blocks":[{"type":"buttons","buttons":[{"label":"Yes","value":"yes"},{"label":"No","value":"no"}]}]}'
```
A button press does not return to the sending process — it arrives at the default
agent as a normal inbound Telegram message with `callback_data: <value>`.

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

### Which agent to use
**Not decided here.** Roster, models, thinking levels, and escalation policy are canonical
in [[system/configs/openclaw-agents]]; the live list is `openclaw agents list --json`.

This page previously carried a full roster table. It was the last surviving duplicate of
that data on the box (Spec 226 removed the others) and was left in place only long enough
to confirm it was correct. It was correct — which is exactly why it was removed: a correct
copy is the one that drifts next, silently, the way the `lead` thinking level did across
three pages.

### Current review chain
```bash
openclaw agent --agent re-review --local --thinking <level> --message "..." --json  # first-pass QA
openclaw agent --agent mid       --local --thinking <level> --message "..." --json  # default escalation
openclaw agent --agent lead      --local --thinking <level> --message "..." --json  # explicit-only
```
Per-agent `--thinking` defaults come from `openclaw.json`; pass one explicitly only to
override. Escalation policy: [[system/configs/openclaw-agents]].
`mid` (isDefault=true) is the default GPT lane; `lead` (isDefault=false) is explicit-only. `main`, `sonnet-review`, and the old OpenClaw `pa` lane are no longer configured. Hermes/Janus independently verifies only mission-critical, high-blast-radius, or user-facing-critical delegated work; routine work ends after the executor's direct verification. Mnemosyne/Nemo (Hermes profile `papipa`) lives separately and remains active.

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
