---
type: system-template
title: Completion Marker Template
slug: completion-marker
last_updated: 2026-08-10
maintainer: cc
canonical: system/workflows/peer-orchestrator-protocol
tags: [ops, template, completion]
---

## Purpose

Use this template for task completion markers written into `tasks/*.done`. It captures
execution status in a grep-friendly shape any orchestrator can review quickly.

The format is canonical in [[system/workflows/peer-orchestrator-protocol]] § Dispatch;
this page is the copy-paste version.

## Canonical Template

```text
STATUS: COMPLETE
TIMESTAMP: <ISO 8601 UTC>
FILES_CHANGED:
  - <path>
ISSUES: none
```

## Notes

- Keep `STATUS` on a single line using `COMPLETE`, `PARTIAL`, or `BLOCKED` when the spec explicitly allows them.
- Use UTC ISO 8601 timestamps, and **generate them with `date -u +%Y-%m-%dT%H:%M:%SZ`** —
  never from the model's own sense of the date. OpenCode-Go executors (`grunt`,
  `grunt-eng`, `re-review`) have a weak clock and have written timestamps months off.
- **Never trust `STATUS:` alone when reviewing** — verify the real artifact, and check
  marker times with `stat -c %y` when audit accuracy matters.
- List every changed file explicitly when the task asks for a canonical marker.
- If the spec asks for extra fields such as `VERIFICATION` or `PHASE_REPORTS`, append them after `ISSUES` without changing the existing field names.
