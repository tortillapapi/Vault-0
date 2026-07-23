---
type: system-config
title: OpenClaw Agents
slug: openclaw-agents
last_synced: 2026-07-23
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
| `lead` | `openai/gpt-5.5` | high | `agent:lead:main` | lead/default | Top OpenClaw reasoning lane. `main` has been merged into this lane; use sparingly for high-judgment orchestration/review. |
| `mid` | `openai/gpt-5.4` | medium | `agent:mid:main` | mid | Medium-complexity review/escalation lane when GLM re-review is not enough. |
| `grunt-eng` | `opencode-go/deepseek-v4-flash` | low | `agent:grunt-eng:main` | grunt-eng | Bounded code/config/parser work and low-risk implementation slices; deliberately kept on DSv4 Flash for now. |
| `grunt` | `opencode-go/deepseek-v4-flash` | low | `agent:grunt:main` | grunt | Basic mechanical work, document transforms, formatting, ingest prep, and low-risk file churn. |
| `re-review` | `opencode-go/glm-5.2` | low | `agent:re-review:main` | specialist | First-pass QA re-review over grunt/grunt-eng output. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --json`; this table last verified 2026-07-09 UTC after merging `main` into `lead` and removing `sonnet-review` plus the unused `pa` lane.**
- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for OpenClaw CLI dispatches.
- `main` is no longer a configured lane; default/high-reasoning OpenClaw work should target `lead` on GPT-5.5/high.
- `sonnet-review` and `pa` are no longer configured lanes. Use `mid` for medium review and reserve `lead` for high-stakes review/escalation.
- `grunt` and `grunt-eng` both run DSv4 Flash. Keep tasks tightly bounded, and escalate to `mid` or `lead` if DSv4 Flash misses code/config details.
- `re-review`/GLM 5.2 is the first-pass QA lane over grunt output.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.
- The old OpenClaw Telegram `pa` route/account was removed; Mnemosyne continues separately under Hermes profile `papipa`.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd before the orchestrator approves it:
1. **`re-review` / GLM 5.2** — first-pass review of any grunt work.
2. **`mid` / GPT-5.4** — medium-to-high-level or important work review when GLM is insufficient or risk is elevated.
3. **`lead` / GPT-5.5** — high-stakes final escalation inside OpenClaw when needed.
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
