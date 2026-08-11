# Skills Index

Mirrored reference documentation for the orchestrator skills. **These are documentation
copies, not the loadable files.** The live sets are:

- CC: `/root/.claude/skills/*.md` (16 skills, verified 2026-08-10)
- Codex: `/root/.codex/skills/<name>/SKILL.md` — real symlinks into CC's files, so content
  cannot drift; membership deliberately excludes dispatch-safety skills since Codex no
  longer dispatches (2026-08-10 decision).
- Hermes: `/root/.hermes/skills/` — a **separate** Nous-managed ecosystem. It is not and
  was never a mirror of these; do not try to reconcile it.

Skills route by tier *name* only. Roster, models, and escalation policy are canonical in
[[system/configs/openclaw-agents]].

- [[dashboard-healthcheck]] — DECOMMISSIONED 2026-06-24. Was read-only spot-check of the Orders Dashboard (was port 5002, orders.db).
- [[fix-iterate]] — Create targeted fix tasks when review identifies specific issues.
- [[n8n-parser-triage]] — Diagnose/recover the n8n order-parser pipeline; deactivation-first triage.
- [[notion-ingest]] — Orchestrate ingestion of Notion pages into the wiki.
- [[notion-push]] — Mirror wiki topic pages out to Notion as a read-surface.
- [[notion-query]] — Query planner for answering questions from Notion content.
- [[oc-dispatch-preflight]] — Pre-dispatch checklist: tier choice, OC context budget, batched self-orchestration.
- [[oc-orchestrator]] — Opt-in CC/Codex orchestration loop: spec, dispatch, verify. (CC is plain by default; this loads only when asked.)
- [[parallel-tasks]] — Execute multiple independent OpenClaw tasks simultaneously.
- [[review-oc-work]] — Review code and files created by OpenClaw execution against specs.
- [[task-spec-template]] — Standard templates for writing task specs and execution prompts.
- [[verify-oc-completion]] — Independently verify an OC .done claim against filesystem/git/service ground truth; emit PASS/PARTIAL/FAIL.
- [[wiki-ingest-orchestrator]] — Plan and orchestrate ingestion of new sources into the wiki.
- [[wiki-lint]] — Periodic health-check of the wiki to surface cross-cutting issues.
- [[wiki-query-planner]] — Translate user questions into wiki search + read + synthesize plans.
- [[wiki-fast-ingest]] — low-ceremony direct ingest by CC in one turn, no spec or dispatch. **Installed 2026-08-10.**
