# Workflows Index

Shared operating procedures. Canonical pages first.

## Canonical

- [[workflows/peer-orchestrator-protocol|peer-orchestrator-protocol]] — **the shared
  contract**: who the peers are, owner/reviewer values, log tags, dispatch and completion
  markers, anti-collision, workspace hygiene.
- [[workflows/session-resume-protocol|session-resume-protocol]] — per-harness resume
  behavior; the deterministic collector pattern.
- [[workflows/lessons-learned|lessons-learned]] — canonical orchestration lessons.
- [[workflows/wiki-operations|wiki-operations]] — the ingest, query, and lint loop.
- [[workflows/notion-sync-protocol|notion-sync-protocol]] — VPS→Notion push, Notion→vault
  capture, Google Tasks lane; invariants and gotchas.
- [[workflows/notion-usage-guide|notion-usage-guide]] — how the Notion workspace is meant
  to be navigated and used.

## Retired / redirects

- [[workflows/tier-routing|tier-routing]] — **merged 2026-08-10** into
  [[configs/openclaw-agents]]; that page owns roster *and* routing.
- [[workflows/orchestrator-role|orchestrator-role]] — **retired 2026-08-10**; described
  the pre-2026-07 doctrine that CC never implements and `lead` is routine. Both false.
- [[workflows/google-tasks-notion-n8n-sync-handoff|google-tasks-notion-n8n-sync-handoff]]
  — **SUPERSEDED 2026-08-05**; the n8n hourly sync failed on every run since ~April
  (deleted OAuth client). Replaced by `notion-sync.timer --gtasks`.
