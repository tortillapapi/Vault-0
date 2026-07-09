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

- Route to **grunt** (`opencode-go/deepseek-v4-flash`, low) for non-code, mechanical, or large-context document work.
- Route to **grunt-eng** (`opencode-go/deepseek-v4-flash`, low) for tightly bounded code/config/parser work that stays at grunt complexity.
- Route to **re-review** (`opencode-go/glm-5.2`, low) for first-pass QA over grunt/grunt-eng output.
- Route to **mid** (`openai/gpt-5.4`, medium) for medium edits, wiring, config, and structured review when GLM review is insufficient or risk is elevated.
- Route to **lead** (`openai/gpt-5.5`, high/default) for architecture, deep debugging, major synthesis, complex multi-file work, or explicit end-to-end OpenClaw self-orchestration.
- `main` and `sonnet-review` are no longer active OpenClaw lanes; target `lead` for top-tier/default OpenClaw work.

## Quick Heuristics

- If the task is mostly copying, formatting, mirroring, or bulk file transforms, use Grunt.
- If the task is bounded implementation, use Grunt-Eng but keep the prompt tight and verify aggressively because it shares DSv4 Flash with Grunt.
- If the task requires judgment but not major architecture, use Mid.
- If the task changes the shape of the system or resolves ambiguity across many files, use Lead.

## Worked Examples

- Mirror a directory of skill docs into `vault/system/`: **grunt**.
- Review a smoke-test ingest against a spec: **re-review**, then **mid** if risk warrants it.
- Rewrite a topic thesis across multiple pages: **lead**.
- Append a simple log close-out entry: **grunt**.
- Build a cross-spec decision summary with grouped outcomes: **lead**.

## Dispatch Pattern

Use the CLI form below when dispatching from CC or from OC main per spec:

```bash
openclaw agent --agent <id> --local --thinking <level> --message "prompt" --json
```

## Session-Key Notes

Typical session keys follow `agent:<id>:main`, for example `agent:lead:main`, `agent:mid:main`, `agent:grunt:main`, `agent:grunt-eng:main`, and `agent:re-review:main`.
