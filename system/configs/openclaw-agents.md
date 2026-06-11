---
type: system-config
title: OpenClaw Agents
slug: openclaw-agents
last_synced: 2026-06-04
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
| `grunt-eng` | `opencode-go/deepseek-v4-pro` | default | `agent:grunt-eng:main` | grunt-eng | Stronger DeepSeek lane for anything slightly complex: coding/engineering, scripts, config edits, parser fixes, and bounded mid-level implementation. |
| `grunt` | `opencode-go/deepseek-v4-flash` | default | `agent:grunt:main` | grunt | Basic execution lane: non-code grunt work, document transforms, file ops, formatting, ingest prep; Flash remains the cheapest/default lane. |
| `re-review` | `opencode-go/qwen3.6-plus` | default | `agent:re-review:main` | specialist | First-pass QA re-review over ALL grunt-agent output (not just email parsing). |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |
| `pa` | `openai/gpt-5.5` | medium | `agent:pa:main` / `telegram:pa` | specialist | Dedicated Telegram personal-assistant profile for reminders, calendar triage, follow-up, lightweight organization, and task capture. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --bindings --json`; this table last verified 2026-06-11.**
- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for CLI dispatches.
- Prefer `grunt` for large-context mechanical work and `grunt-eng` for small code tasks.
- `grunt` and `grunt-eng` are split by complexity: use `grunt`/DeepSeek Flash for basic execution and large mechanical transforms; use `grunt-eng`/DeepSeek Pro for anything slightly complex, especially code, config, parser, or bounded mid-level implementation.
- For medium-to-high-level or important work, review DeepSeek output with both `re-review`/Qwen and OC GPT (`mid` or `lead`) by default unless the orchestrator judges the risk low enough to skip GPT during a quota hold.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.
- `pa` is bound only to Telegram account `pa`; the default Telegram account remains routed to `main` by default routing.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd before the orchestrator approves it:
1. **`re-review`** (Qwen3.6-plus, OpenCode Go) — first-pass review of any grunt work.
2. **`mid` or `lead`** (GPT-5.5) — also review medium-to-high-level or important work by default; use orchestrator judgment to skip GPT only when the risk is low or an active GPT quota hold makes Qwen-only review the better tradeoff.
This applies to all grunt-agent work, not only the email parser.
