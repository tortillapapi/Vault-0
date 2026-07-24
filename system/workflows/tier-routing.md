---
type: system-workflow
title: Tier Routing
slug: tier-routing
last_synced: 2026-07-24
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

- Route to **grunt** (`opencode-go/deepseek-v4-flash`, medium) for non-code, mechanical, or large-context document work.
- Route to **grunt-eng** (`opencode-go/deepseek-v4-flash`, medium) for tightly bounded code/config/parser work that stays at grunt complexity.
- Route to **re-review** (`opencode-go/glm-5.2`, medium) for first-pass QA over grunt/grunt-eng output.
- Route to **mid** (`openai/gpt-5.6-luna`, xhigh) for default GPT escalation, judgment-heavy review, structured review when GLM review is insufficient or risk is elevated. This is the primary GPT lane.
- Route to **lead** (`openai/gpt-5.6-sol`, xhigh) **only** for exceptionally hard tasks, architecture/strategy with unusually high uncertainty, or when grunt/re-review/mid are stuck. This is an explicit-only escalation lane — not for routine or scheduled work.
- `main` and `sonnet-review` are no longer active OpenClaw lanes. `mid` is now the default OpenClaw agent.

## Quick Heuristics

- If the task is mostly copying, formatting, mirroring, or bulk file transforms, use Grunt.
- If the task is bounded implementation, use Grunt-Eng but keep the prompt tight and verify aggressively because it shares DSv4 Flash with Grunt.
- If the task requires judgment or structured review, use Mid — this is the default GPT escalation tier.
- If the task is exceptionally hard, involves architecture/strategy with unusually high uncertainty, or other agents are stuck, use Lead (explicit-only).
- **No automatic or routine scheduled work should target Lead.**

## Worked Examples

- Mirror a directory of skill docs into `vault/system/`: **grunt**.
- Review a smoke-test ingest against a spec: **re-review**, then **mid** if risk warrants it.
- Rewrite a topic thesis across multiple pages: **lead** (exceptional — only when mid would struggle).
- Append a simple log close-out entry: **grunt**.
- Build a cross-spec decision summary with grouped outcomes: **mid** (default GPT tier) or **lead** if the synthesis is exceptionally complex.

## Dispatch Pattern

Use the CLI form below when dispatching from CC or from OC main per spec:

```bash
openclaw agent --agent <id> --local --thinking <level> --message "prompt" --json
```

## Session-Key Notes

Typical session keys follow `agent:<id>:main`, for example `agent:lead:main`, `agent:mid:main`, `agent:grunt:main`, `agent:grunt-eng:main`, and `agent:re-review:main`.
