---
type: system-config
title: OpenClaw Agents
slug: openclaw-agents
last_synced: 2026-05-26
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
| `main` | `openai/gpt-5.5` | xhigh | `agent:main:main` | main | Top-tier default for complex coding, multi-file work, and self-orchestration of multi-phase specs. |
| `lead` | `openai/gpt-5.5` | high | `agent:lead:main` | lead | Architecture, deep debugging, complex coding, and heavyweight synthesis. |
| `mid` | `openai/gpt-5.5` | medium | `agent:mid:main` | mid | Medium-complexity edits, wiring, config changes; AND the second review stage after `re-review` on grunt-agent output. |
| `grunt-eng` | `opencode-go/deepseek-v4-pro` | default | `agent:grunt-eng:main` | grunt-eng | Grunt-level coding/engineering: simple code edits, scripts, small fixes. |
| `grunt` | `opencode-go/deepseek-v4-pro` | default | `agent:grunt:main` | grunt | Non-code grunt work, long-context document transforms, file ops, formatting, ingest prep. |
| `re-review` | `opencode-go/qwen3.6-plus` | default | `agent:re-review:main` | specialist | First-pass QA re-review over ALL grunt-agent output (not just email parsing). |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --json`; this table last verified 2026-05-21.**
- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for CLI dispatches.
- Prefer `grunt` for large-context mechanical work and `grunt-eng` for small code tasks.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd in two stages before the
orchestrator approves it:
1. **`re-review`** (Qwen3.6-plus, OpenCode Go) — first-pass review of any grunt work.
2. **`mid`** (GPT-5.5, thinking medium) — second review after `re-review`.
This applies to all grunt-agent work, not only the email parser.
