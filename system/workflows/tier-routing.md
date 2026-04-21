---
type: system-workflow
title: Tier Routing
slug: tier-routing
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/CLAUDE.md
  - /root/.claude/projects/-root/memory/reference_agent_dispatch.md
  - /root/.claude/projects/-root/memory/reference_oc_cli_cheatsheet.md
tags: [ops, workflow, routing]
---

## Purpose

Use this page when deciding which OC tier should own a task. It turns the agent roster into a practical routing rule with concrete examples.

## Routing Rule

- Route to **grunt** for non-code, mechanical, or large-context document work.
- Route to **grunt-eng** for simple code changes that stay at grunt complexity.
- Route to **mid** for medium edits, wiring, config, and structured review.
- Route to **lead** for architecture, deep debugging, major synthesis, and complex multi-file work.
- Keep work on **main** when OC main is explicitly executing the phase end-to-end or when the orchestrator needs to do the synthesis directly.

## Quick Heuristics

- If the task is mostly copying, formatting, mirroring, or bulk file transforms, use Grunt.
- If the task requires judgment but not major architecture, use Mid.
- If the task changes the shape of the system or resolves ambiguity across many files, use Lead or main.

## Worked Examples

- Mirror a directory of skill docs into `vault/system/`: **grunt**.
- Review a smoke-test ingest against a spec: **mid**.
- Rewrite a topic thesis across multiple pages: **lead**.
- Append a simple log close-out entry: **grunt**.
- Build a cross-spec decision summary with grouped outcomes: **main** or **lead**.

## Dispatch Pattern

Use the CLI form below when dispatching from CC or from OC main per spec:

```bash
openclaw agent --agent <id> --local --thinking <level> --message "prompt" --json
```

## Session-Key Notes

Typical session keys follow `agent:<id>:main`, with `agent:main:main` for main and `agent:grunt:main` for the Kimi grunt tier.
