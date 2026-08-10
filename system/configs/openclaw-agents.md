---
type: system-config
title: OpenClaw Agents & Tier Routing
slug: openclaw-agents
canonical_for: [agent-roster, tier-routing, review-chain, dispatch-policy]
last_verified: 2026-08-10
maintainer: cc
tags: [ops, config, agents, routing]
---

# OpenClaw Agents & Tier Routing

**This page is the single authority for which tier gets which work.** It absorbed
`workflows/tier-routing.md` on 2026-08-10.

> **The live CLI is authoritative for the roster itself.** Run
> `openclaw agents list --json` before trusting any model name or flag below — the table
> is a convenience cache, last verified **2026-08-10 UTC** against `openclaw.json`.
> What this page uniquely owns, and the CLI cannot tell you, is the **routing policy**:
> the "when to use" column, the escalation rules, and the review chain.

## Agent table

| Agent ID | Model | Thinking | Session key | When to use |
|---|---|---|---|---|
| `mid` | `openai/gpt-5.6-luna` | xhigh | `agent:mid:main` | **Default GPT lane** (`isDefault=true`). Judgment-heavy work, structured review, synthesis, multi-phase specs. First escalation from grunt tier. |
| `lead` | `openai/gpt-5.6-sol` | xhigh | `agent:lead:main` | **Explicit-only** escalation (`isDefault=false`). Exceptionally hard tasks, architecture/strategy with unusually high uncertainty, or when grunt/re-review/mid are stuck. **Never** routine or scheduled work. |
| `grunt-eng` | `opencode-go/deepseek-v4-flash` | medium | `agent:grunt-eng:main` | Tightly bounded code/config/parser work and low-risk implementation slices. |
| `grunt` | `opencode-go/deepseek-v4-flash` | medium | `agent:grunt:main` | Mechanical, non-code, large-context work: document transforms, formatting, mirroring, ingest prep, log entries. |
| `re-review` | `opencode-go/glm-5.2` | medium | `agent:re-review:main` | First-pass QA over grunt/grunt-eng output. |
| `email-parser` | `google/gemini-2.5-flash` | default | `agent:email-parser:main` | Email parsing only. |

`main`, `sonnet-review`, and the old OpenClaw `pa` lane are **no longer configured**.
Ignore any doc, skill, or memory entry that routes to them.

## Routing rule

- Mechanical / formatting / bulk transforms → **grunt**
- Bounded implementation → **grunt-eng** (keep the prompt tight and verify aggressively;
  it shares DSv4 Flash with grunt)
- First-pass QA over grunt output → **re-review**
- Judgment, review, synthesis, anything ambiguous → **mid**
- Genuinely stuck, or architecture with unusual uncertainty → **lead**, explicitly, once

**No automatic or scheduled job may target `lead`.** Any recurring `openclaw cron` or
systemd job that wakes an OpenAI agent runs at the lowest tier that does the job —
default recurring audits to `mid` or `re-review`, and re-audit periodically.

## Worked examples

- Mirror a directory of skill docs into `system/` → **grunt**
- Review a smoke-test ingest against a spec → **re-review**, then **mid** if risk warrants
- Append a log close-out entry → **grunt**
- Rewrite a topic thesis across many pages → **mid**; **lead** only if mid would struggle
- Wiki lint / cross-page consistency → **mid** (was routed to lead under retired doctrine)
- Cross-spec decision summary → **mid**

## Review chain

**Match review depth to task risk — do NOT run the full ladder on routine work.** Most
routine data edits (a one-line Sheet/DB update) need zero review beyond the executor's own
verification: apply, verify, done. Escalate only when risk warrants:

1. **`re-review`** (GLM 5.2, medium) — first-pass QA for non-trivial grunt work.
2. **`mid`** (GPT-5.6-luna, xhigh) — judgment-heavy or elevated-risk review, only if
   `re-review` is insufficient.
3. **`lead`** (GPT-5.6-sol, xhigh) — exceptional only.

Do not add extra passes or a mandatory orchestrator self-checkpoint for routine changes;
reserve independent peer verification for genuinely high-risk or user-facing-critical work.
Bound every review prompt to the spec, the changed files/diff, test output, and the `.done`
marker — never broad session history. Inherited context is the main review-cost leak.

## Dispatch pattern

```bash
openclaw agent --agent <id> --local --thinking <level> --message "prompt" --json
```

Full command reference: [[system/cheatsheets/oc-cli]]. Use `openclaw message send`, never
`agent --deliver`, when the job is simple message relay.

## Cost discipline

Quota and dispatch-cost rules are canonical in
[[system/cheatsheets/operating-rules]] (§ Dispatch & verification). The short version:
OpenClaw's OpenAI pool (`mid`/`lead`) is the scarce one and is separate from Hermes's
account; DeepSeek and GLM are separate pools; one project is one pre-approved dispatch,
not a fresh GPT session per phase.

## OpenAI subscription binding

All VPS OpenAI agents are unified under the `themetalman13@gmail.com` ChatGPT Business
workspace.

- **Account**: `8c334dd3-05ab-4d1d-b862-6a7743b46bcd`, plan claim `chatgpt_plan_type=team`
- **OpenClaw `lead`/`mid`**: per-agent auth order restricted to
  `openai:themetalman13@gmail.com` only. Legacy Plus profiles in the non-configured `main`
  store are archived and unreachable from effective selection.
- **Codex CLI**: standalone, migrated to the same Business workspace.
- **Hermes/default (Janus)**: uses the same Business workspace.
- **Verification**: use JWT workspace/plan claims and `effectiveProfiles` from
  `/v1/accounts` / `/v1/dashboard`. Email address alone is insufficient. Never include
  OAuth tokens, device codes, or secrets.

## Data residency

OpenCode Go serves the current `deepseek-v4-flash` route from China-hosted infrastructure
and requires the workspace's China-hosted-model opt-in. Papi explicitly enabled it on
2026-08-01 for the Milo and `grunt`/`grunt-eng` lanes. Treat this as an explicit
data-residency decision; do not enable it for another workspace or profile without user
consent. Run explicit and saved-default probes after changing the route.

## Known model quirks

- **OpenCode-Go agents have a weak clock** (provider-wide). Always inject exact dates into
  task prompts, require `date -u` for completion markers, and verify `.done` times with
  `stat -c %y` when audit accuracy matters. OpenAI agents are unaffected.
- **Grunt-tier agents echo secrets into artifacts.** Instruct "confirm properties only,
  never print values", and grep the artifact for the secret afterward.
