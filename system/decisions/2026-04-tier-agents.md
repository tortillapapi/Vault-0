---
type: system-decision
title: April 2026 Tiered Agent Decisions
slug: 2026-04-tier-agents
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/specs/10-create-lead-agent.md
  - /root/specs/11-create-mid-agent.md
  - /root/specs/12-configure-grunt-main.md
  - /root/tasks/10-create-lead-agent.done
  - /root/tasks/11-create-mid-agent.done
  - /root/tasks/12-configure-grunt-main.done
dates: 2026-04-19 to 2026-04-19
tags: [ops, decisions, agents, tiers]
---

## Context

The orchestration workflow needed a clearer separation between heavyweight reasoning, medium review work, and low-tier grunt execution. Before these tasks, the roster was too flat, and the main Kimi-bound agent was carrying both identity and routing expectations that no longer matched the actual work split.

## Decisions

1. Add a `lead` agent on `openai-codex/gpt-5.4` as the top-tier reasoning and architecture lane.
2. Add a `mid` agent on `openai-codex/gpt-5.3-codex` for medium-complexity edits, reviews, and wiring work.
3. Recast the existing Kimi-backed `main` identity as grunt-tier so easy tasks have an explicit default lane without changing its Telegram binding.

## Outcome

The tiered roster shipped and gave later specs a much cleaner routing model. One cosmetic wrinkle remained: the shared `IDENTITY.md` layer overrode the intended display name for `main`, so the routing logic was correct even though the visible identity was not perfectly aligned. That mismatch later drove the follow-up documentation cleanup around the new dedicated `grunt` agent profile.

## Artifacts

- [[#10-create-lead-agent|10-create-lead-agent]]
- [[#11-create-mid-agent|11-create-mid-agent]]
- [[#12-configure-grunt-main|12-configure-grunt-main]]

### 10-create-lead-agent
- Spec: /root/specs/10-create-lead-agent.md
- Done: /root/tasks/10-create-lead-agent.done

### 11-create-mid-agent
- Spec: /root/specs/11-create-mid-agent.md
- Done: /root/tasks/11-create-mid-agent.done

### 12-configure-grunt-main
- Spec: /root/specs/12-configure-grunt-main.md
- Done: /root/tasks/12-configure-grunt-main.done
