# System Index

Catalog of internal ops knowledge mirrored and synthesized under `system/`.

## Skills

- [[skills/oc-orchestrator|oc-orchestrator]] — CC orchestration role and task delegation rules.
- [[skills/review-oc-work|review-oc-work]] — review checklist for OC outputs.
- [[skills/fix-iterate|fix-iterate]] — follow-up fix loop pattern.
- [[skills/parallel-tasks|parallel-tasks]] — parallelizable task planning guidance.
- [[skills/task-spec-template|task-spec-template]] — mirrored skill for writing specs and prompts.
- [[skills/wiki-ingest-orchestrator|wiki-ingest-orchestrator]] — planning rules for wiki ingestion.
- [[skills/wiki-query-planner|wiki-query-planner]] — query planning against the wiki.
- [[skills/wiki-lint|wiki-lint]] — periodic wiki health checks.
- [[skills/notion-ingest|notion-ingest]] — ingest Notion pages into the wiki.
- [[skills/notion-push|notion-push]] — mirror wiki topics out to Notion.
- [[skills/notion-query|notion-query]] — answer questions that require Notion content.
- [[skills/index|skills index]] — all mirrored skill docs in one list.

> Skill mirrors are documentation only. The live sets are `/root/.claude/skills/*.md` (CC)
> and `/root/.codex/skills/*/SKILL.md` (symlinks into CC's files). Verify on disk before
> trusting this list — see [[configs/openclaw-agents]] for routing, never a skill page.

## Workflows

- [[workflows/peer-orchestrator-protocol|peer-orchestrator-protocol]] — the shared contract between all peer orchestrators (canonical).
- [[workflows/wiki-operations|wiki-operations]] — ingest, query, and lint loop overview.
- [[workflows/session-resume-protocol|session-resume-protocol]] — per-harness resume behavior; the collector pattern.
- [[workflows/lessons-learned|lessons-learned]] — canonical operating lessons from real runs.
- [[workflows/google-tasks-notion-n8n-sync-handoff|google-tasks-notion-n8n-sync-handoff]] — **SUPERSEDED 2026-08-05** by `notion-sync.timer --gtasks`.
- [[workflows/index|workflows index]] — workflow summary list.

## Templates

- [[templates/task-spec-template|task-spec-template]] — mirrored task-spec writing guide.
- [[templates/completion-marker|completion-marker]] — canonical completion-marker format.
- [[templates/review-template|review-template]] — review report and review-done template.
- [[templates/index|templates index]] — template summary list.

## Resources

- [[resources/registry|registry]] — master map of every resource all agents can access.

## Projects

- [[projects/bookmark-hell-pipeline|bookmark-hell-pipeline]] — parked MVP plan for X/TikTok bookmark capture, categorization, hybrid storage, and resurfacing.
- [[projects/n8n-order-parser|n8n-order-parser]] — order automation state.
- [[projects/orders-dashboard|orders-dashboard]] — orders dashboard state.

## Runbooks

- [[runbooks/cloud-session-vps-bootstrap|cloud-session-vps-bootstrap]] — **blocked at Phase 0**: a standard Claude Code cloud session cannot reach the VPS over SSH at all (proxied, domain-allowlisted egress only). Vault-via-git remains its only VPS-adjacent access.
- [[runbooks/index|runbooks index]] — all operational runbooks.

## Cheatsheets

- [[cheatsheets/oc-cli|oc-cli]] — OpenClaw CLI quick reference.
- [[cheatsheets/obsidian-conventions|obsidian-conventions]] — naming, linking, and frontmatter rules.
- [[cheatsheets/operating-rules|operating-rules]] — **canonical** standing rules for every agent.
- [[cheatsheets/index|cheatsheets index]] — cheatsheet summary list.

## Configs

- [[configs/milo-fitness|milo-fitness]] — Hermes workout/nutrition bot, Pacific-date schema, and maintenance.
- [[configs/mnemosyne-pa|mnemosyne-pa]] — PA subsystem (bot retired 2026-08-10, machinery live under Janus).
- [[configs/openclaw-agents|openclaw-agents]] — **canonical** agent roster *and* tier routing, review chain, dispatch policy.
- [[configs/hermes-profiles|hermes-profiles]] — **all six Hermes profiles**, what drives each, and which are live.
- [[configs/metis-gateway|metis-gateway]] — CC over Telegram; permission gate and roster.
- [[configs/vault-layout|vault-layout]] — where wiki work vs system work belongs.
- [[configs/index|configs index]] — config summary list.

## Decisions

- [[decisions/2026-04-fallback-pipeline|2026-04-fallback-pipeline]] — pipeline fallback architecture choices.
- [[decisions/2026-04-telegram-setup|2026-04-telegram-setup]] — Telegram delivery choices for Gmail setup.
- [[decisions/2026-04-tier-agents|2026-04-tier-agents]] — lead, mid, and grunt-tier formation.
- [[decisions/2026-04-notion-integration|2026-04-notion-integration]] — Notion skill rollout and routing cleanup.
- [[decisions/2026-04-wiki-smoke-test|2026-04-wiki-smoke-test]] — vault hygiene and smoke-test outcomes.
- [[decisions/2026-08-orchestration-authority-model|2026-08-orchestration-authority-model]] — the authority/precedence model for all orchestration docs.
- [[decisions/index|decisions index]] — chronological decision summary list.

## Glossary

- [[glossary]] — shared definitions for CC, OC, tiers, session keys, specs, and vault terms.
