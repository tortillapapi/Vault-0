# Wiki Log

*Chronological append-only record of wiki activity. Each entry starts with*
*a line matching `^## \[` for grep-friendly parsing.*

## [2026-05-15] [cc] fix | Order parser refinement pass (spec 50.2)
- Subject-line gate added (reject promo subjects)
- order_last4 hardened (4-digit requirement + stopword filter v2)
- Item Name sentence-fragment rejector extended
- Cancelled-with-no-order# rows now dropped
- Item-Name-only partial-row bug fixed (root cause: master merge propagated malformed source rows)
- 10 retailer hard-exclusions added (Weedmaps, Uber Eats, TikTok Shop, J. Crew, Panda Express, Abercrombie family, Amazon Pharmacy only, Domino's, Musely, Charles Tyrwhitt)
- Lids.com handling: path (b), drop blank Delivered rows and rely on promo subject gate
- Backfill: 46 rows removed from per-account + master sheets
- All three workflows reactivated after gates passed
- Tier: lead-equivalent self (gates + reactivation), mid-equivalent self (parser + investigation), grunt-eng-equivalent self (backfill), grunt-equivalent self (docs)

## [2026-05-15] [cc] fix | Order parser quality pass (spec 50.1)
- Tightened LLM Item Name prompt + post-validation
- Tightened order-number regex (min len 4, must have digit, stopword filter)
- Extended sender exclusions to 8 food-delivery platforms
- All three workflows reactivated after re-test passed
- Tier: mid-equivalent self (fixes + re-test), lead (reactivation), grunt-equivalent self (docs)

## [2026-05-15] [cc] build | n8n purchase-order parser shipped (spec 50)
- Two per-account workflows: mramirez021111 + themetalman13
- Master-merge workflow unions both into "Purchase Log - Master"
- Daily 09:00 PT per-account, 09:15 PT merge
- Replaces disabled Gemini scheduled task
- Tier: lead (workflow A + activation), mid-equivalent self-review (clone B + master merge), grunt-equivalent docs

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

## [2026-04-22] update | inventory-tracker-pipeline — hardening pass
- Added: systemd TimeoutStartSec=900, retailer normalizer, orders upsert, Gmail after:2025/10/01 filter
- Fixed: mid agent empty-response JSONDecodeError
- Topic page updated: wiki/topics/inventory-tracker-pipeline.md (v2)
- Tier: grunt (CC-authored content)

## [2026-04-22] [cc] update | re-review agent (Qwen 3.6+)
- Spec 35 implemented: dedicated `re-review` agent on opencode-go/qwen3.6-plus
- Replaces GPT-5.3-Codex in the inventory-tracker mid-review pass
- Goal: stop draining OpenAI Codex quota on repetitive email parsing
- Tier: grunt-eng (CC-authored content)

## [2026-04-26] [cc] shutdown | inventory-tracker pipeline disabled
- Spec 36 executed: stopped + disabled `inventory-tracker-ingest.timer`,
  `inventory-tracker-ingest.service`, `inventory-dashboard.service`
- Unit files removed; daemon-reload run
- Reason: pipeline superseded by Gemini-native parsing system
- Tier: grunt (mechanical systemd ops)

## [2026-04-27] [cc] archive | inventory-tracker workspace archived
- Spec 37 executed: moved `/root/.openclaw/workspace/inventory-tracker/` →
  `/root/archive/inventory-tracker-old-2026-04/workspace/`
- Copied related specs/tasks/reviews into the same archive
- OAuth credentials preserved at `/root/secrets/gmail-oauth/` for future Gemini system
- Cleanup timer scheduled for 2026-05-27
- Tier: grunt (file moves only)

## [2026-04-27] [cc] schema | peer-orchestrator unification (CC + Codex)
- Spec 38 executed by OC main self-orchestration
- New: `/root/AGENTS.md` (Codex's CLAUDE.md analogue, 216 lines)
- New: `system/workflows/peer-orchestrator-protocol.md` (103 lines)
- Updated: `/root/CLAUDE.md` with Peer Orchestrator section
- Skills mirrored: 11 CC skills now have YAML frontmatter and are
  symlinked into `/root/.codex/skills/<name>/SKILL.md`
- Tier chain: main (gpt-5.4) → mid (gpt-5.3-codex) → grunt + grunt-eng

## [2026-04-27] [cc] cleanup | OC workspace archived legacy bridge + inventory remnants
- Spec 40 executed
- Moved: top-level bridge docs (8), inventory/sheets files (5), 2 old
  session handoffs, reports/, scripts/, systemd/, tmp/, specs/, tasks/,
  handoff/2026-04-19, handoff/2026-04-21
- Destination: /root/archive/oc-workspace-2026-04/
- Live OC infra untouched (.git, .openclaw, bin, skills, vault, identity files)
- Tier: grunt (file moves), mid (verification)

## [2026-04-27] [cc] wrap | phase-4 wrap-up — arc closed
- Spec 41 executed
- Arc covered: spec 36 (shutdown), 37 (archive), 38 (peer-orchestrator),
  39 (wiki refresh), 40 (workspace cleanup)
- Handoff: /root/reviews/session-2026-04-27-handoff.md
- System verified in clean steady state
- Tier: lead (synthesis), grunt (log append)

## [2026-04-27] [cc] feature | Orders Dashboard live (spec 42)
- Flask + SQLite + Chart.js dashboard on http://srv1535917.hstgr.cloud:5002/d/<token>/
- Source: Orders — Master sheet (All tab) via Sheets API (Vertex SA, readonly scope)
- systemd: orders-dashboard.service + orders-pull.timer (hourly)
- Auth: token-in-URL, secret at /root/secrets/orders-dashboard/url-token.txt
- Tier chain: grunt-eng (build) → mid (review) → grunt (docs)

## [2026-04-27] [cc] schedule | Orders Dashboard 7-day spot-check armed (spec 43)
- One-shot systemd timer: orders-dashboard-7day-check.timer
- Fires: 2026-05-04 18:00 UTC
- On healthy: Telegram ✅ summary
- On problem: Telegram ⚠️ + writes /root/tasks/42-orders-dashboard-7day-check.blocked
- Script: /root/orders-dashboard/scripts/seven-day-check.sh
- Tier: grunt-eng (script + units), grunt (docs)

## [2026-04-27] [cc] fix | Orders Dashboard spend totals corrected (spec 44)
- Price column from source sheet is the line total, not unit price
- Removed erroneous * quantity from get_retailer_totals, get_monthly_totals, overview scorecard
- Service restarted; verified via SUM(price) sanity query + live overview
- Tier: grunt-eng (3 surgical edits + restart + verify), grunt (this log entry)

## [2026-04-27] [cc] release | Orders Dashboard v1.0
- Stamped /root/orders-dashboard/VERSION = 1.0
- Wiki topic page updated with Version section
- v2 backlog noted as LOW priority — no auto-suggestions
- Tier: grunt (3 file writes)

## [2026-04-28] [cc] schedule | Vault auto-pull timer (every 6h)
- Spec 47: vault-pull.timer + vault-pull.service installed on VPS
- Pull-only: git pull --rebase, never commits/pushes, aborts on conflict
- Cadence: OnBootSec=10min, OnUnitActiveSec=6h
- Closes the "stale read" gap when CC/Codex sessions just query the vault
- Tier: grunt-eng (script + units), grunt (this log)

## [2026-04-28] [cc] config | Vault auto-pull cadence changed 6h → 1h (spec 48)
- /etc/systemd/system/vault-pull.timer: OnUnitActiveSec=6h → 1h
- Reasoning: stale-window concern; per-pull risk is ~zero so frequency
  is a free knob to tune
- Tier: grunt-eng (sed edit + daemon-reload), grunt (this log)

## [2026-04-28] [cc] wrap | Session 2026-04-28 arc closed (specs 42-49)
- Arc: orders dashboard build/deploy/fix/v1.0 + vault sync infrastructure
- Handoff: /root/reviews/session-2026-04-28-handoff.md
- Discipline rules #7 (vault commits) + #8 (Notion mirror) added to CLAUDE.md / AGENTS.md
- Trio (Mac/GitHub/VPS) in sync; vault-pull.timer running every 1h
- Tier: lead (synthesis + verification), grunt (index bump + log)

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
