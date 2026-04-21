---
type: system-workflow
title: Session Resume Protocol
slug: session-resume-protocol
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/CLAUDE.md
tags: [ops, workflow, sessions]
---

## Purpose

Use this page at the start of a CC session to recover project state before taking new work. It records the exact resume behavior defined in `CLAUDE.md`, including the wiki-specific status additions.

## Base Protocol

Before responding to the first user message in a session:

1. Run `ls specs/ tasks/ reviews/ 2>/dev/null`.
2. For each spec in `specs/`, check whether a matching `tasks/<name>.done` exists.
3. Identify any `tasks/<name>.blocked` files.
4. Report status in this format:

```text
📋 SESSION RESUME — [current date]

Active project: [infer from spec filenames, or "none detected"]

Completed tasks:
- [list each task with a .done file]

Pending tasks (spec exists, no .done):
- [list each]

Blocked tasks:
- [list each, with the blocker reason from the .blocked file]

Suggested next action: [pick the next pending task in dependency order,
or "awaiting your direction" if unclear]
```

5. Then wait for the user's actual request.

## Wiki-Specific Additions

When the user asks for `status`, `resume`, or `where are we` while wiki work is active, include:

- The most recent 3 ingests from `log.md`
- Any open `.done` files without matching `.review`
- Any open `.review` files with `FIX_TASK` recommendations not yet acted on
- Total page count by wiki type using quick directory counts
