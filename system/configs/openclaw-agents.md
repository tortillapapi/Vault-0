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
| `main` | `openai/gpt-5.5` | xhigh | `agent:main:main` | main | Top-tier default; conserve during the current OpenCode Go quota outage unless explicitly needed. |
| `lead` | `openai/gpt-5.4` | medium | `agent:lead:main` | lead | Architecture/deep debugging lane during outage mode; must be reviewed by `sonnet-review`/strong-review before orchestrator approval. |
| `mid` | `openai/gpt-5.4` | medium | `agent:mid:main` | mid | Medium-complexity edits, wiring, config changes, and second-stage review; must be reviewed by `sonnet-review`/strong-review before orchestrator approval. |
| `sonnet-review` | `google/gemini-2.5-pro` | medium | `agent:sonnet-review:main` | specialist | Active strong-review fallback for `mid`/`lead` output while Anthropic credits are unavailable. Preferred target is Claude Sonnet when Anthropic access is restored. |
| `grunt-eng` | `openai/gpt-5.4-mini` | low | `agent:grunt-eng:main` | grunt-eng | Bounded code/config/parser work and low-risk implementation slices during OpenCode Go outage mode. |
| `grunt` | `google/gemini-2.5-flash-lite` | default | `agent:grunt:main` | grunt | Basic mechanical work, document transforms, formatting, ingest prep, and low-risk file churn during OpenCode Go outage mode. |
| `re-review` | `google/gemini-2.5-flash` | default | `agent:re-review:main` | specialist | First-pass QA re-review over ALL grunt-agent output while OpenCode Go/Qwen and Anthropic/Haiku are unavailable. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |
| `pa` | `openai/gpt-5.5` | medium | `agent:pa:main` / `telegram:pa` | specialist | Dedicated Telegram personal-assistant profile for reminders, calendar triage, follow-up, lightweight organization, and task capture. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --json`; this table last verified 2026-07-02 UTC during temporary OpenCode Go outage routing.**
- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for CLI dispatches.
- Current outage-mode routing avoids `opencode-go/*` lanes until weekly usage resets.
- Prefer `grunt` for large-context mechanical work and `grunt-eng` for bounded code/config work.
- `grunt` and `grunt-eng` are split by complexity: use `grunt`/Gemini Flash-Lite for basic execution and large mechanical transforms; use `grunt-eng`/GPT-5.4-mini for anything slightly complex, especially code, config, parser, or bounded mid-level implementation.
- `re-review`/Gemini Flash is first-pass QA over grunt output during the outage. Anthropic Haiku was considered but live health check failed due low Anthropic credits.
- `sonnet-review` is the required strong-review lane for `mid`/`lead` output before Hermes/Janus final checkpoint. It is currently backed by Gemini 2.5 Pro because the exposed Claude Sonnet lane rejected live calls for low Anthropic credits; flip it back to Claude Sonnet once Anthropic access is funded/restored.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.
- `pa` is bound only to Telegram account `pa`; the default Telegram account remains routed to `main` by default routing.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd before the orchestrator approves it:
1. **`re-review`** (Gemini 2.5 Flash) — first-pass review of any grunt work during outage mode.
2. **`mid` or `lead`** (GPT-5.4, medium thinking) — review medium-to-high-level or important work by default.
3. **`sonnet-review` / strong-review** (currently Gemini 2.5 Pro fallback; preferred Claude Sonnet when Anthropic credits are restored) — required review for `mid` and `lead` output before Hermes/Janus final checkpoint.
4. **Hermes/Janus** — final checkpoint and independent verification before user-facing approval.
This applies to all grunt-agent work, not only the email parser.
