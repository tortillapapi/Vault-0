---
type: system-workflow
title: Session Resume Protocol
slug: session-resume-protocol
canonical_for: [session-resume]
last_updated: 2026-08-10
maintainer: cc
tags: [ops, workflow, sessions]
---

# Session Resume Protocol

**There is no box-wide resume ritual.** Resume behavior is per-harness, and for most
harnesses the correct behavior is to do nothing and answer the user.

| Harness | At session start | Mechanism |
|---|---|---|
| **Hermes (Janus)** | Runs the collector, then reports | `/root/scripts/hermes-session-resume.py --mode=markdown` |
| **CC** | **Nothing.** Greet or answer directly | Resume only in opt-in orchestrator mode (`/root/ORCHESTRATOR.md`) |
| **Metis** (CC over Telegram) | **Nothing** — actively suppressed | Gateway system prompt forbids the sweep; Telegram is not the place for a status dump |
| **Codex** | **Nothing.** Answer directly | Resume only in opt-in orchestrator mode |

## The collector is the pattern

When a resume *is* wanted, prefer the deterministic collector over a manual directory
walk:

```bash
/root/scripts/hermes-session-resume.py --mode=markdown
```

It returns ~1.5 KB of Markdown (or ~2 KB JSON) covering active specs, pending tasks,
blockers with a >24h flag, fresh `.progress` anti-collision markers, the last 20 vault
log entries, and a deterministic suggested next action.

This exists because the alternative — `ls specs/ tasks/ reviews/` and reasoning over the
listing — costs a large multiple of the tokens for a worse answer, and gets worse every
month as the workspace grows (154 specs / 1000 task artifacts / 400 reviews as of
2026-08-10). Bounded, deterministic collectors are the house style for any bulk evidence:
reduce raw listings, SQL, and history dumps to compact JSON/Markdown before they reach a
model.

**Note:** the collector currently emits Hermes-flavored output (it labels the report
`hermes`). Generalizing it with an `--agent` flag is a runtime change and belongs in its
own spec, not a docs pass.

## Report format

```text
📋 SESSION RESUME (<agent>) — [date]

Active project: [inferred, or "none detected"]
Completed:      [tasks with a .done]
Pending:        [spec exists, no .done]
Blocked:        [with reason from the .blocked file, >24h flagged]
Suggested next action: [next pending task in dependency order, or "awaiting your direction"]
```

Then wait for the user's actual request. If `specs/` and `tasks/` are both empty, skip
the block and greet normally.

## Manual fallback

Only when the collector is unavailable, and only in orchestrator mode: `ls specs/ tasks/
reviews/`, match each spec to a `tasks/<name>.done`, and surface `.blocked` files. This
is the path the collector was built to replace — reach for it as a fallback, not a
default.

## Wiki additions

When the user asks for `status` / `resume` / `where are we` while wiki work is active,
add: the 3 most recent ingests from `log.md`; `.done` files with no matching `.review`;
`.review` files with unacted `FIX_TASK` recommendations; and page counts by wiki type.
