---
type: system-config
title: OpenClaw Agents
slug: openclaw-agents
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/.claude/projects/-root/memory/reference_oc_cli_cheatsheet.md
  - /root/.claude/projects/-root/memory/reference_agent_dispatch.md
tags: [ops, config, agents]
---

## Purpose

Use this table to choose the right OpenClaw agent before dispatching work. It summarizes the tier split, default thinking level, session key, and the intended use of each configured agent.

## Agent Table

| Agent ID | Model | Thinking level | Session key | Tier | When to use |
|---|---|---|---|---|---|
| `main` | `openai-codex/gpt-5.4` | default | `agent:main:main` | main | Top-tier default for complex coding, multi-file work, and orchestration tasks that stay with OC main. |
| `lead` | `openai-codex/gpt-5.4` | high | `agent:lead:main` | lead | Architecture, deep debugging, complex coding, and heavyweight synthesis. |
| `mid` | `openai-codex/gpt-5.3-codex` | medium | `agent:mid:main` | mid | Medium complexity edits, reviews, wiring work, config changes, and structured verification. |
| `grunt-eng` | `opencode-go/glm-5.1` | default | `agent:grunt-eng:main` | grunt-eng | Grunt-level coding and engineering tasks: simple code edits, scripts, and small fixes. |
| `grunt` | `opencode-go/kimi-k2.5` | default | `agent:grunt:main` | grunt | Non-code grunt work, long-context document transforms, file ops, formatting, and ingest preparation. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |

## Dispatch Notes

- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for CLI dispatches.
- Prefer `grunt` for large-context mechanical work and `grunt-eng` for small code tasks.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.
