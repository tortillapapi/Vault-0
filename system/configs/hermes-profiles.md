---
type: system-config
title: Hermes Profiles
slug: hermes-profiles
canonical_for: [hermes-profile-roster]
last_verified: 2026-08-11
maintainer: cc
tags: [ops, config, hermes, agents]
---

# Hermes Profiles

Hermes runs more than one agent. Until 2026-08-11 only two of its six profiles were
documented anywhere in `system/`, which meant an orchestrator deciding where to send work
could not see half the fleet — and one profile with a **daily production role** described
itself as having none.

**Live truth:** `hermes profiles list`, `hermes cron list`, and
`systemctl --user list-units 'hermes*'`. This page is the routing intent and the status
each profile claims versus what it actually does.

## The profiles

| Profile | Model | Role | Driven by | Status (verified 2026-08-11) |
|---|---|---|---|---|
| *(default)* — **Janus** | `gpt-5.6-luna` / `openai-codex` | Primary orchestrator; also the PA since 2026-08-10 | `hermes-gateway.service` (user unit), Telegram | **Live** |
| `papipa` | `deepseek-v4-pro` / `opencode-go` | PA capture kernel, reminders, daily command stack | 2 Hermes cron jobs, both renamed "Janus …" | **Gateway disabled; cron machinery live** — see [[system/configs/mnemosyne-pa]] |
| `milo` | — | Fitness/nutrition bot | `hermes-gateway-milo.service` (user unit) | **Live** — see [[system/configs/milo-fitness]] |
| `hermesbuild` | `deepseek-v4-flash` / `opencode-go` | "Bounded implementation, collectors, file transformations" | Ad-hoc delegation from Janus | Used (4 sessions); no schedule |
| `hermesreview` | `glm-5.2` / `opencode-go` | "Independent QA and verification" | Ad-hoc delegation from Janus | Used (3 sessions); no schedule |
| `hermesparser` | *(none set in profile)* | n8n order-parser daily accuracy audit | **`hermes-parser-audit.timer`, daily 16:20 UTC / 09:20 PT** | **Live production** — see below |

## `hermesparser` — its self-description is wrong

`/root/.hermes/profiles/hermesparser/profile.yaml` reads:

> `description: Isolated future parser-audit canaries; no schedule or production role yet`

That is false and has been for some time. `/root/scripts/hermes-parser-audit-runner.sh`
line 65 invokes:

```bash
hermes -p hermesparser chat -Q --ignore-rules --source cron \
  -m gpt-5.6-luna --provider openai-codex -t terminal,file --max-turns 30 -q "$(<"$PROMPT_FILE")"
```

…and that runner is driven by `hermes-parser-audit.timer`, which is **enabled and
active**. Last run 2026-08-10 16:20 UTC, completed successfully, 31.8s CPU. The audit
writes to `system/logs/n8n-parser-daily-check.md`.

Two things follow:

1. **Anyone reading that description would conclude the profile is safe to modify, retire,
   or repoint.** It is not — it is on the critical path of a daily audit against real order
   data. The description is the drift; the runtime is correct.
2. **The model binding lives in the shell script, not the profile.** `config.yaml` sets no
   default model; the runner passes `-m gpt-5.6-luna --provider openai-codex` explicitly.
   Changing the profile's model config would have no effect — change the runner.

The likely history: the profile was created for the disabled cron canary "Hermes Parser
Shadow Enqueue" (`3d36a18c58eb`, still present and still disabled), and the production
runner later adopted the same profile without the description being revisited.

**Fix belongs to Hermes**, not CC — `/root/.hermes/` is Hermes's private state under
[[system/workflows/peer-orchestrator-protocol]] § Private resources. Logged here for the
owning agent to correct.

## Two executor fleets, not one

Worth noticing when routing: `hermesbuild` (DeepSeek V4 Flash) and `hermesreview`
(GLM 5.2) run **the same models as OpenClaw's `grunt-eng` and `re-review`**. Hermes has a
small executor fleet that mirrors the bottom two OpenClaw tiers.

That is not a defect — a Hermes subagent avoids the `openclaw` dispatch round-trip and
draws on a different quota pool. But it does mean "delegate this" has two valid answers,
and the choice should be deliberate:

- **OpenClaw tiers** — work that belongs in the shared `specs/` / `tasks/` / `reviews/`
  audit trail, anything another peer may need to pick up, and anything needing the
  `re-review → mid` ladder. Routing: [[system/configs/openclaw-agents]].
- **Hermes subagents** — Janus-internal decomposition where the audit trail is the parent
  task, not the subtask.

Do not treat the two fleets as interchangeable in a spec: a spec that says "dispatch to
grunt-eng" means the OpenClaw lane, and the `.done` marker convention applies.

## Stock SOUL files

All three of `hermesbuild`, `hermesparser`, and `hermesreview` carry the **unmodified
stock Nous `SOUL.md`** ("You are Hermes Agent, an intelligent AI assistant created by Nous
Research…"). No role-specific persona, no house conventions, no awareness of the shared
spec/task/review contract.

For `hermesbuild` and `hermesreview` that is defensible — they receive fully-specified
prompts from Janus. For `hermesparser` it is a live gap: a production audit agent whose
persona file tells it nothing about this box, with all of the actual instruction arriving
in the runner's prompt file. That works today because the prompt is thorough. It is worth
knowing that it is the prompt, not the profile, carrying the whole contract.
