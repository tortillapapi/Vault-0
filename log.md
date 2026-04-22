# Wiki Log

*Chronological append-only record of wiki activity. Each entry starts with*
*a line matching `^## \[` for grep-friendly parsing.*

## [2026-04-19] schema | initial schema v0.1
- WIKI_SCHEMA.md created
- Vault directory structure initialized
- Ready for first ingest

## [2026-04-21] ingest | Test Source — System Smoke Test
- Source: raw/clips/test-source.md
- Pages touched: 6 (4 created, index + log updated)
- Contradictions: none
- Tier: grunt (Kimi K2.5) → mid-review pending

## [2026-04-21] review | Test Source smoke test — ACCEPTED
- Mid tier (GPT 5.3 Codex): OVERALL_STATUS PASS, RECOMMENDATION ACCEPT
- CC sign-off: reviews/ingest-test-source-signoff.md
- Closes out mid-review-pending status on prior 2026-04-21 entry
- Orchestration loop CC → Grunt → Mid → CC validated end-to-end

## [2026-04-21] schema | v0.1 → v0.2 — added system tree

## [2026-04-21] ingest | System tree bootstrap
- Pages touched: 40 (37 under `system/`, plus `WIKI_SCHEMA.md`, `index.md`, and `log.md`)
- Scope: skills mirror, cheatsheets, templates, configs, workflows, decisions, glossary, and system catalog wiring
- Tier chain: main (gpt-5.4) → grunt (Kimi K2.5) → main (gpt-5.4)

## [2026-04-22] decision | Inventory pipeline operations — tiered parser + dashboard
- Decision doc: system/decisions/2026-04-inventory-pipeline-ops.md
- Topic page: wiki/topics/inventory-tracker-pipeline.md
- Covers: Gemini → GLM-5.1/GPT-5.3 model switch, noise filter, feedback loop, dashboard build
- Tier: grunt (direct write, CC-authored content)

## [2026-04-22] schema | v0.2 → v0.3 — semantic memory: priority tiers + domain tags + core-index
- Added priority field (core/reference/archive) to all page types
- Added domain_tags taxonomy and session loading protocol to WIKI_SCHEMA.md
- Created core-index.md (always-load manifest, ≤ 40 lines)
- Retroactively tagged all existing pages
- context.include updated to auto-load core-index.md

---

*Entries are appended by the Grunt tier during ingests, by CC during lint*
*and query operations, and by humans when making schema changes.*

*Quick queries:*
```bash
# Last 10 entries
grep "^## \[" log.md | tail -10

# Only ingests
grep "^## \[.*\] ingest" log.md

# Activity on a specific date
grep "^## \[2026-04-19\]" log.md
```
