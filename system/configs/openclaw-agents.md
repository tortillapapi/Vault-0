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
| `main` | `openai/gpt-5.5` | xhigh | `agent:main:main` | main | Leave alone; do not burn unless explicitly needed. |
| `lead` | `openai/gpt-5.4` | medium | `agent:lead:main` | lead | Leave on GPT-5.4, but avoid dispatch unless the task truly needs it; route output through Sonnet 5 review before orchestrator approval. |
| `mid` | `anthropic/claude-sonnet-4-6` | medium | `agent:mid:main` / `openclaw-claude-lane mid` | mid | Medium-complexity review/escalation lane. Because Anthropic API credits are unavailable, prefer Claude Code CLI: `openclaw-claude-lane mid`. |
| `sonnet-review` | `anthropic/claude-sonnet-5` | high | `agent:sonnet-review:main` / `openclaw-claude-lane sonnet-review` | specialist | Strong reviewer for `mid` and `lead` output before Hermes/Janus final checkpoint. Use Claude Code CLI route by default: `openclaw-claude-lane sonnet-review`. |
| `grunt-eng` | `openai/gpt-5.4-mini` | low | `agent:grunt-eng:main` | grunt-eng | Bounded code/config/parser work and low-risk implementation slices during OpenCode Go outage mode. |
| `grunt` | `google/gemini-2.5-flash-lite` | default | `agent:grunt:main` | grunt | Basic mechanical work, document transforms, formatting, ingest prep, and low-risk file churn during OpenCode Go outage mode. |
| `re-review` | `anthropic/claude-haiku-4-5` | low | `agent:re-review:main` / `openclaw-claude-lane re-review` | specialist | First-pass QA re-review over ALL grunt-agent output. Because Anthropic API credits are unavailable, prefer Claude Code CLI: `openclaw-claude-lane re-review`. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |
| `pa` | `openai/gpt-5.5` | medium | `agent:pa:main` / `telegram:pa` | specialist | Dedicated Telegram personal-assistant profile for reminders, calendar triage, follow-up, lightweight organization, and task capture. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --json`; this table last verified 2026-07-02 UTC after adding Claude Code CLI Anthropic lanes.**
- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for non-Anthropic OpenClaw CLI dispatches.
- For Anthropic-class lanes while the Anthropic API provider is credit-blocked, use `/root/bin/openclaw-claude-lane <lane>` instead of `openclaw agent`: `re-review` -> `claude-haiku-4-5` low, `mid` -> `claude-sonnet-4-6` medium, `sonnet-review` -> `claude-sonnet-5` high.
- Current outage-mode routing avoids `opencode-go/*` lanes until weekly usage resets.
- Prefer `grunt` for large-context mechanical work and `grunt-eng` for bounded code/config work.
- `grunt` and `grunt-eng` are split by complexity: use `grunt`/Gemini Flash-Lite for basic execution and large mechanical transforms; use `grunt-eng`/GPT-5.4-mini for anything slightly complex, especially code, config, parser, or bounded mid-level implementation.
- `re-review`/Claude Haiku is first-pass QA over grunt output; invoke it through Claude Code CLI (`openclaw-claude-lane re-review`) while Anthropic API credits are unavailable.
- `mid`/Claude Sonnet 4.6 is the medium-complexity review/escalation lane; invoke it through Claude Code CLI (`openclaw-claude-lane mid`) while Anthropic API credits are unavailable.
- `sonnet-review`/Claude Sonnet 5 is the required strong-review lane for `mid` and `lead` output before Hermes/Janus final checkpoint; invoke it through Claude Code CLI (`openclaw-claude-lane sonnet-review`) while Anthropic API credits are unavailable.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.
- `pa` is bound only to Telegram account `pa`; the default Telegram account remains routed to `main` by default routing.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd before the orchestrator approves it:
1. **`re-review` / Claude Haiku 4.5** — first-pass review of any grunt work. Use `openclaw-claude-lane re-review` while Anthropic API credits are unavailable.
2. **`mid` / Claude Sonnet 4.6 or `lead` / GPT-5.4** — medium-to-high-level or important work review. Use `openclaw-claude-lane mid` for the Sonnet lane; avoid `lead` dispatch unless needed.
3. **`sonnet-review` / Claude Sonnet 5** — required strong review for `mid` and `lead` output before Hermes/Janus final checkpoint. Use `openclaw-claude-lane sonnet-review`.
4. **Hermes/Janus** — final checkpoint and independent verification before user-facing approval.
This applies to all grunt-agent work, not only the email parser.
