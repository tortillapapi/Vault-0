---
type: system-workflow
title: Peer Orchestrator Protocol
slug: peer-orchestrator-protocol
canonical_for: [shared-orchestration-conventions, owner-frontmatter, review-format, log-tags, anti-collision, workspace-hygiene]
last_updated: 2026-08-10
maintainer: cc
tags: [ops, workflow, orchestration, shared-brain]
---

# Peer Orchestrator Protocol

**This page is the single source of truth for the conventions every orchestrator on
this VPS shares.** If a `/root` guidance file disagrees with this page, this page wins
and the `/root` pointer should be re-synced.

## Who the peers are

An orchestrator is any harness that can author specs, dispatch work to OpenClaw, and
review completion markers using the conventions below. OpenClaw itself is **not** a
peer — it is the executor tier.

| Peer | Guidance file | Posture | Notes |
|---|---|---|---|
| **Hermes** (Janus, Nous harness) | `/root/.hermes.md` | orchestrator by design | The primary orchestrator. Loads **only** `.hermes.md` — it does not read `CLAUDE.md` or `AGENTS.md`, by design, so shared rules it must obey are restated there with a pointer back here. |
| **Claude Code (CC)** | `/root/CLAUDE.md` | plain by default | Orchestrates only when the user asks (`/root/ORCHESTRATOR.md`). Usually a tmux session on the VPS, reached remotely from the Claude app. |
| **Metis** | `/root/CLAUDE.md` + gateway prompt | plain by default | **A surface of CC, not a separate peer** — CC driven over Telegram by `/root/metis-gateway/gateway.py` (`cwd=/root`). Signs work as `metis` so Telegram-origin work is traceable. |
| **Codex CLI** | `/root/AGENTS.md` | plain by default | Retained as a peer but effectively dormant — it has never owned a spec and no longer dispatches. Do not assume it is running. |

Mnemosyne / "Nemo" (Hermes profile `papipa`) was **retired 2026-08-10**. Its PA duties
were folded into Janus with a separate Telegram chat for personal-assistant work; the
`papipa` cron jobs still run under Janus's name. It is not an orchestrator and is no
longer a live bot. See [[system/configs/mnemosyne-pa]].

## Shared resources

Working surfaces every peer MAY read and write, subject to the rules below:

- `/root/specs/` — specifications. **Audit trail; never deleted.**
- `/root/tasks/` — task prompts and `.done` / `.blocked` / `.progress` / `.review` markers.
- `/root/reviews/` — review outputs. **Audit trail; never deleted.**
- `/root/obsidian-vault/system/` — shared ops knowledge and governance (this tree).
- `/root/context/` — session handoffs and cross-session lessons.

## Private resources

Peers MUST NOT read each other's private sidecars, except where a rule below carves
out an explicit exception. Shared knowledge belongs in `system/`, never in another
peer's private directory.

- CC: `/root/.claude/` (including `projects/*/memory/`).
- Codex: `/root/.codex/` (`memories/`, `sessions/`, `history.jsonl`).
- Hermes: `/root/.hermes/` (config, `kanban.db`, `state.db`, `sessions/`, `memories/`).
  Hermes's kanban is private working memory only — project state lives in the shared
  files above, never solely in the kanban.

**Carve-out (user-approved 2026-06-04):** the Mission Control usage tracker may read
ONLY the `rate_limits` field from the newest Codex session rollout under `/root/.codex/`
and under `/root/.openclaw/agents/{main,lead,mid,pa}/agent/codex-home/sessions/`
(used_percent, window minutes, reset timing) — never prompt/response text, transcripts,
auth, or anything else. This carve-out binds all peers equally.

## Spec frontmatter

Specs MAY carry an `owner:` field naming the orchestrator that should run them.

```yaml
---
spec: 226-example
owner: hermes   # hermes | cc | metis | codex; omit for unowned
---
```

Valid values: `hermes`, `cc`, `metis` (CC's Telegram surface), `codex`. Before starting
a spec, check the frontmatter. If it is owned by another peer, do not start without
explicit user reassignment.

## Log discipline

Every new entry in `/root/obsidian-vault/log.md` MUST tag the writing orchestrator
immediately after the `## [date] type |` header: `[hermes]`, `[cc]`, `[metis]`, `[codex]`.

```markdown
## 2026-04-27 ingest | [cc] Added Foo source
## 2026-06-02 config | [hermes] Tuned fallback providers
```

Untagged historical entries are treated as CC-authored. Do not rewrite old entries to
add tags.

## Session start

Each peer runs the resume behavior defined for it in
[[system/workflows/session-resume-protocol]] — which for CC and Codex means **no resume
routine at all** unless orchestrator mode was requested. There is no protocol-level
requirement to run a status sweep at session start.

When picking up shared work mid-stream (any peer, any mode):

1. Check `/root/tasks/` for `.blocked` files older than 24h and surface them.
2. Read the last 20 entries of `log.md` for cross-peer awareness before planning.
3. Apply `/root/context/` lessons before starting new orchestration work.

## Dispatch

Dispatch through the `openclaw` CLI as documented in
[[system/cheatsheets/oc-cli]]. Choose the tier per
[[system/configs/openclaw-agents]] — that page is the only routing authority; the live
CLI (`openclaw agents list --json`) is authoritative for which agents exist.

Task prompts MUST inline all context the receiving tier needs. OpenClaw has no memory
between tasks and cannot read any peer's private state.

Completion markers use exactly this format:

```text
STATUS: COMPLETE
TIMESTAMP: 2026-04-27T<HH:MM:SS>Z
FILES_CHANGED:
  - /path/to/file (created/modified/appended)
ISSUES: none
```

Never trust `STATUS` alone — verify the real artifact. OpenCode-Go models have a weak
clock; verify `.done` times with `stat -c %y` when audit accuracy matters.

## Review format

Reviews live in `/root/reviews/` (or alongside the task) and use this format:

```text
STATUS: ACCEPT | REJECT
REVIEW_TYPE: orchestrator | executor-qa
TIMESTAMP: 2026-04-27T<HH:MM:SS>Z
REVIEWER: hermes | cc | metis | codex | <oc-agent-id>
TARGET: /root/tasks/<task>.done
FINDINGS:
  - none | specific issue
REQUIRED_FIXES:
  - none | specific fix task
```

`REVIEW_TYPE` distinguishes accountability from instrumentation, and both are legitimate:

- **`orchestrator`** — a peer signing off. Only a peer may write this, and only a peer's
  ACCEPT closes a spec.
- **`executor-qa`** — a dispatched OpenClaw agent (`re-review`, `mid`, …) reporting a QA
  pass. Informs the orchestrator's decision; never substitutes for it.

An ACCEPT means the `.done` satisfies the spec. A REJECT MUST name concrete fixes and
exact file paths. Reviews written before 2026-08-10 predate `REVIEW_TYPE`; read the
`REVIEWER` value to infer which kind they are, and do not backfill old files.

## Anti-collision

Run one orchestrator at a time per project, or keep peers on different specs.

Before dispatching for a spec, check for a `.progress` file. If its mtime is under 30
minutes old, assume another peer is mid-flight and do not duplicate the dispatch.

If a collision surfaces after work begins: stop new dispatches, append a `.blocked`
marker explaining the overlap, and wait for user direction. Never resolve a collision by
editing another peer's private state.

## Workspace hygiene

- Task artifacts for terminal specs (frontmatter status exactly `complete`, `completed`,
  `superseded`, or `cancelled_by_user`) are archived under
  `/root/tasks/archive/<spec-range>/` (e.g. `spec122-211/`).
- `.progress` markers move to `/root/tasks/archive/hygiene-<UTC>-<description>/` at spec
  closeout — **only** after verifying the matching `.done` exists or the spec status is
  terminal.
- Specs and reviews are the audit trail and are never archived or deleted.
- Move, never delete: everything stays under `/root/tasks/archive/`.

## Vault discipline

Any change that writes to `/root/obsidian-vault` ends with
`git pull --rebase && git add -A && git commit && git push`. Never force-push. Work
touching only `specs/`, `tasks/`, or `reviews/` skips git — those are not in the vault.
