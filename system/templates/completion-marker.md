---
type: system-template
title: Completion Marker Template
slug: completion-marker
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/CLAUDE.md
tags: [ops, template, completion]
---

## Purpose

Use this template for task completion markers written into `tasks/*.done`. It captures execution status in a grep-friendly shape that CC can review quickly.

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
- Use UTC ISO 8601 timestamps.
- List every changed file explicitly when the task asks for a canonical marker.
- If the spec asks for extra fields such as `VERIFICATION` or `PHASE_REPORTS`, append them after `ISSUES` without changing the existing field names.
