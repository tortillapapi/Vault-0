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
| `lead` | `openai/gpt-5.5` | high | `agent:lead:main` | lead/default | Top OpenClaw reasoning lane. `main` has been merged into this lane; use sparingly for high-judgment orchestration/review. |
| `mid` | `openai/gpt-5.4` | medium | `agent:mid:main` | mid | Medium-complexity review/escalation lane when GLM re-review is not enough. |
| `grunt-eng` | `opencode-go/deepseek-v4-flash` | low | `agent:grunt-eng:main` | grunt-eng | Bounded code/config/parser work and low-risk implementation slices; deliberately kept on DSv4 Flash for now. |
| `grunt` | `opencode-go/deepseek-v4-flash` | low | `agent:grunt:main` | grunt | Basic mechanical work, document transforms, formatting, ingest prep, and low-risk file churn. |
| `re-review` | `opencode-go/glm-5.2` | low | `agent:re-review:main` | specialist | First-pass QA re-review over grunt/grunt-eng output. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | specialist | Email parsing only. |
| `pa` | `openai/gpt-5.5` | medium | `agent:pa:main` / `telegram:pa` | specialist | Dedicated Telegram personal-assistant profile for reminders, calendar triage, follow-up, lightweight organization, and task capture. |

## Dispatch Notes

- **Live roster is authoritative via `openclaw agents list --json`; this table last verified 2026-07-09 UTC after merging `main` into `lead` and removing `sonnet-review`.**
- Use `openclaw agent --agent <id> --local --thinking <level> --message "..." --json` for OpenClaw CLI dispatches.
- `main` is no longer a configured lane; default/high-reasoning OpenClaw work should target `lead` on GPT-5.5/high.
- `sonnet-review` is no longer a configured lane. Use `mid` for medium review and reserve `lead` for high-stakes review/escalation.
- `grunt` and `grunt-eng` both run DSv4 Flash. Keep tasks tightly bounded, and escalate to `mid` or `lead` if DSv4 Flash misses code/config details.
- `re-review`/GLM 5.2 is the first-pass QA lane over grunt output.
- Use `message send` instead of `agent --deliver` when the job is simple message relay.
- `pa` is bound only to Telegram account `pa`; the default OpenClaw agent is now `lead`.

## Review Chain
Grunt-tier output (`grunt`, `grunt-eng`) is QA'd before the orchestrator approves it:
1. **`re-review` / GLM 5.2** — first-pass review of any grunt work.
2. **`mid` / GPT-5.4** — medium-to-high-level or important work review when GLM is insufficient or risk is elevated.
3. **`lead` / GPT-5.5** — high-stakes final escalation inside OpenClaw when needed.
4. **Hermes/Janus** — final checkpoint and independent verification before user-facing approval.
This applies to all grunt-agent work, not only the email parser.
