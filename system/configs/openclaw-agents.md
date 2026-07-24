---
type: system-config
title: OpenClaw Agents
slug: openclaw-agents
last_synced: 2026-07-24
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
| `lead` | `openai/gpt-5.6-sol` | xhigh | `agent:lead:main` | lead | **Explicit-only** escalation lane for exceptionally hard tasks, architecture/strategy with unusually high uncertainty, or when grunt/re-review/mid are stuck. Not for routine use. |
| `mid` | `openai/gpt-5.6-sol` | xhigh | `agent:mid:main` | mid | Default/normal GPT escalation and judgment-heavy review lane. First GPT tier for review and synthesis. |
| `grunt-eng` | `opencode-go/deepseek-v4-flash` | low | `agent:grunt-eng:main` | grunt-eng | Bounded code/config/parser work and low-risk implementation slices; deliberately kept on DSv4 Flash for now. |
| `grunt` | `opencode-go/deepseek-v4-flash` | low | `agent:grunt:main` | grunt | Basic mechanical work, document transforms, formatting, ingest prep, and low-risk file churn. |
| `re-review` | `opencode-go/glm-5.2` | low | `agent:re-review:main` | specialist | First-pass QA re-review over grunt/grunt-eng output. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --json`; this table last verified 2026-07-24 UTC.**
- Both GPT lanes (`mid`, `lead`) now run `openai/gpt-5.6-sol` with `xhigh` thinking. `mid` is the default agent (`isDefault=true`); `lead` is explicit-only (`isDefault=false`).
- `main` is no longer a configured lane. `lead` is no longer the default — `mid` fills that role.
- `sonnet-review` and the old OpenClaw `pa` lane are no longer configured lanes. Hermes profile `papipa` (Mnemosyne/Nemo) continues separately and remains active, unaffected by OpenClaw changes.
- `grunt` and `grunt-eng` both run DSv4 Flash. Keep tasks tightly bounded, and escalate to `mid` (or `lead` only if mid is stuck) if DSv4 Flash misses code/config details.
- `re-review`/GLM 5.2 is the first-pass QA lane over grunt output.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd before the orchestrator approves it:
1. **`re-review` / GLM 5.2** — first-pass review of any grunt work.
2. **`mid` / GPT-5.6-sol (xhigh)** — judgment-heavy or elevated-risk review when GLM is insufficient. Default GPT escalation tier.
3. **`lead` / GPT-5.6-sol (xhigh)** — **exceptional only**: when grunt/re-review/mid are stuck, or for architecture/strategy with unusually high uncertainty.
4. **Hermes/Janus** — final checkpoint and independent verification before user-facing approval.
This applies to all grunt-agent work, not only the email parser.

## OpenAI Subscription Binding

All VPS OpenAI agents are unified under `themetalman13@gmail.com` ChatGPT Business workspace.

- **Account**: `8c334dd3-05ab-4d1d-b862-6a7743b46bcd`, plan claim `chatgpt_plan_type=team`
- **OpenClaw `lead`/`mid`**: per-agent auth order restricted to `openai:themetalman13@gmail.com` only. Legacy Plus profiles in the non-configured `main` store are archived and unreachable from effective selection.
- **Codex CLI**: standalone, migrated to `themetalman13@gmail.com` Business workspace.
- **Hermes/default**: uses `themetalman13@gmail.com` Business workspace.
- **Hermes/milo**: has no own OpenAI credential; remains `opencode-go/DeepSeek`. Inherited CLI display may show default Business, but milo's own configured pool is empty.
- **Verification**: use JWT workspace/plan claims and `effectiveProfiles` from `/v1/accounts` / `/v1/dashboard`. Email address alone is insufficient. Never include OAuth tokens, device codes, or secrets.
