# Wiki Log

*Chronological append-only record of wiki activity. Each entry starts with*
*a line matching `^## \[` for grep-friendly parsing.*

## [2026-05-26] [cc] ops | Order-parser OAuth outage recovery + audit tooling
- ~11-day silent outage (since ~May 15): all runs errored while workflows showed `active=true`
- Root cause: n8n moved behind Caddy HTTPS proxy (`https://n8n.rareforceone.cloud`) → `redirect_uri_mismatch`; consent screen in "Testing" → 7-day refresh-token expiry revoked all 4 Google creds (gmail_a/b, sheets_a/b)
- Fix: re-authed all 4 + **Published** the consent screen (permanent); 14-day backfill run
- New CC skills: n8n-parser-triage, dashboard-healthcheck, oc-dispatch-preflight, verify-oc-completion (+ mirrors in system/skills/)
- New /root/scripts helpers via OC: sheets-read.sh (spec 60), verify-done-files.sh (spec 59), gmail-orders-list.sh (spec 61)
- Daily accuracy-audit cron (OC lead, 16:30 UTC through 2026-06-01, self-expiring) → runbook system/runbooks/n8n-parser-daily-audit.md, log system/logs/n8n-parser-daily-check.md; chain validated end-to-end
- Open finding from validation run: precision flagged a UPS row (…8250, 2026-05-18) as a possible false positive — for review
- Tier: cc (orchestration), mid (helper scripts), lead (audit cron)

## [2026-05-21] [cc] update | n8n-order-parser topic page updated for Spec 50.3
- outage recovery + appendRows fix
- Tier: grunt (docs)

## [2026-05-15] [cc] ops | Order parser orphan-row cleanup
- 32 orphan rows discovered in Account B source sheet (themetalman13)
- Pattern: text in column 9 (Last Updated), all key columns blank
- Origin: legacy pre-50.x parser write path (not currently reproducible)
- User manually deleted from Account B source sheet (+ additional cleanup, 108 → 23 rows)
- CC rebuilt Master via direct master invocation (94 → 60 rows, 0 orphans)
- Known-limitations note added to wiki topic; filter broadening deferred
- Tier: cc (investigation), user (manual delete), grunt (docs)

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

## [2026-05-21] [cc] ingest | Spec 51 — shared knowledge registry
- New: system/resources/ (registry + index), system/projects/ (n8n-order-parser + orders-dashboard + index)
- New: system/cheatsheets/operating-rules.md (standing feedback rules)
- Refreshed: system/configs/openclaw-agents.md (main→gpt-5.5, +re-review), system/cheatsheets/oc-cli.md, system/index.md
- Tier: grunt (file writes), mid (verification), main (commit)

## [2026-05-26] [cc] ingest | Spec 54 — governance file mirror
- New: system/governance/ (index + 5 mirror pages of CC/Codex/OpenClaw governance files)
- Purpose: in-Obsidian visibility + line-budget audit of always-loaded instruction/memory files
- Tier: grunt (reads, writes, log, commit)

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

## [2026-05-26] [codex] config | Spec 67 — Telegram PA profile
- Added OpenClaw agent `pa` with workspace `/root/.openclaw/workspace-pa`
- Added Telegram account `pa` bound only to agent `pa`; default Alfred Telegram behavior preserved
- Gateway restarted via `openclaw gateway restart`; verification saved in `/root/reviews/67-telegram-pa-profile-verification.md`
- Tier: mid

## [2026-05-26] [cc] lint | Spec 57 — governance mirror re-sync after trims
- Updated: system/governance/{cc-claude-md,codex-agents-md,openclaw-agents-md}.md + index.md
- Reflects line cuts from specs 55 (CC+Codex de-dup) and 56 (OC trim)
- Tier: grunt

## [2026-05-26] [cc] maint | Specs 54–57 — governance mirror + trim
- New: system/governance/ mirror + audit dashboard (spec 54)
- Trimmed always-loaded governance files (specs 55/56): CC CLAUDE.md 224→115,
  Codex AGENTS.md 239→146, OC workspace AGENTS.md 232→105 (~47% cut). Wiki block
  de-duplicated to skill/system pointers; stale inline agent roster removed.
- Dated .bak backups beside each (/root not git-versioned).
- Mirror re-synced, dashboard all 🟢 (spec 57).
- New operating rule: back up /root configs before editing (spec 58).
- Tier: grunt (edits/log/commit), mid (trim review)

## [2026-05-28] [cc] maint | Specs 69–77 — order-parser migrated off n8n onto a systemd timer
- Root cause CLOSED: n8n 2.17.7 cannot run this parser. Code nodes execute in the keyless
  `@n8n/task-runner` so `n8n export:credentials --decrypted` fails; the `executeCommand`
  node is UNRECOGNIZED in this build (spec 75 restart → "Activation … did fail" for all 3
  workflows). Both n8n execution paths are dead.
- Spec 76: parser now runs via systemd `order-parser.{service,timer}` (daily 09:00
  America/Los_Angeles, TimeoutStartSec=600) → `/root/scripts/run-order-parser.sh` →
  `docker exec n8n-n8n-1 node order_parser.js` for account a→b→master. Guarded canary
  passed (idempotent; 0 dup/blank rows). The 3 n8n parser workflows were DEACTIVATED
  (not deleted). n8n is now only the credential store.
- Spec 77: re-pointed all monitoring off n8n executions onto the systemd run status. New
  `/root/scripts/parser-run-status.sh`; updated the Codex snapshot + both review prompts +
  audit runbook section 1 (commit 3be2758). n8n-inactive is now expected, not an alarm.
- One-shot OC cron `parser-timer-first-run-verify` set for 2026-05-29 16:20 UTC to confirm
  the timer's first unattended run (Telegram).
- Open follow-up: fully decouple Google auth from n8n so the container is not a dependency.
- Tier: CC orchestration + review; OC mid executed specs 75/76/77.

## [2026-05-28] [codex] maint | Order-parser Google auth fully decoupled from n8n
- Created parser-owned minimized credential file:
  `/root/secrets/order-parser/credentials.json` (`0600`).
- Updated production parser path to read that file directly; removed `n8n export:credentials`
  from `/root/n8n/local-files/order-parser/order_parser.js`, `/root/scripts/sheets-read.sh`,
  and `/root/scripts/gmail-orders-list.sh`.
- Updated `/root/scripts/run-order-parser.sh` to use host Node directly and removed the Docker
  dependency from `order-parser.service`.
- Verified direct auth for both Gmail accounts, account/master sheet headers, Opencode key,
  host Node master dry-run, no-match account dry-runs, and Codex checker snapshot path.
- Result: n8n parser workflows remain retired; n8n is no longer the parser runtime,
  scheduler, or Google credential source.

## [2026-05-29] [cc] fix | Specs 79–81 — bundled multi-order email accuracy (account_b eBay)
- Trigger: user's 5 Eevee-GX SM233 orders arrived in ONE eBay "Your order is confirmed"
  email (msgId 19e6d7a034712107, 2026-05-28). Parser only ever captured one order per
  email → 03304/03305 dropped (fixed last session, spec 79). This session hardened the
  multi-order path further after the user spot-checked the data.
- Spec 80: `validateItemName` now rejects eBay layout boilerplate (`ID:<digits>` /
  `order number` fragments) → reason `ebay_layout_boilerplate`; recovered real titles
  for 03304/03305 via the existing LLM fallback.
- Spec 81 (the substantive one): found + fixed TWO real bugs in the spec-79 segmenter.
  (A) Off-by-one — blocks were bounded STARTING at each order number, but in this email
  layout item name+price PRECEDE the order number, so every multi-order row was shifted
  one item. Re-bounded blocks to END at each order number (start_i = end_{i-1}).
  (B) Totals-footer bleed — the last block ran to end-of-body and grabbed "Total charged
  to $644.36" as 03307's price; the re-bound also fixes this (last block stops at the
  final order number). Also added eBay multi-unit qty pattern `(N x $unit)` so 03303
  correctly shows qty 3.
- Corrected 5 live cells on account_b from the authoritative email (CC-verified on the
  sheet, not just the .done): 03303 qty→3; 03304 name→"…Full Art Promo"/$80.00;
  03305 name→"…SM Promo"/$74.99; 03306 $85→$95.00; 03307 $644.36→$85.00. Master rebuilt.
- Parser code + sheet state only — NO vault commit for the parser work itself (this log
  entry is the only vault write). Backups: order_parser.js.bak-20260528-spec80,
  .bak-20260529-spec81. Single-order path untouched; regression dry-run clean.
- Known accuracy gaps logged for later (user wants accuracy+uptime first, name-matching
  later): qty still defaults to 1 when no explicit cue; multi-order item names lean on
  the LLM and aren't independently cross-checked.
- Tier: CC orchestration + verification; OC main (gpt-5.5) executed specs 80/81.

## [2026-05-29] [cc] fix | Specs 82–84 — item-name fidelity, msgId column, gated cleanup
- Reviewed first unattended systemd-timer run (16:00 UTC, clean; watchdog flipped to OK
  after the 11-day outage streak).
- Spec 82 (DONE/verified): item-name fidelity — cleaner LLM excerpt + Alibaba extractor
  + honest placeholder `(item name unavailable)`; multi-item emails annotated
  `(+N more items)` (no fabrication). Backup order_parser.js.bak-20260529-spec82.
- Spec 83 (CONDITIONAL): added account-sheet-only column J "Source Msg ID" (Gmail msgId
  per row) — prerequisite for durable self-heal (re-fetch any row by id past the 2-day
  window). Schema correct, master left 9-col (dashboard safe), header checks pass,
  idempotent, no dup rows. Defect: Phase-2 backfill mis-assigned one msgId across 3
  unrelated account_a orders (low impact, col J unused yet). Backup ...-spec83.
- Spec 84 (DRAFTED, gated): verify-by-refetch cleanup + tighten backfill matcher; held
  until the 05-30 run is verified clean.
- Archived 3 stale task markers (50-anthropic, 60-resolved, 50_4 403) to tasks/archive/.
- `/schedule` is REMOTE (cloud, no VPS access) → used a LOCAL systemd transient timer
  `spec84-gated-dispatch.timer` (Sat 05-30 16:30 UTC, Persistent) to verify the run then
  conditionally dispatch spec 84 + Telegram the outcome.
- Parser code + sheets are NOT vault; signoffs live in reviews/. This log entry is the
  only vault write.
- Tier: CC orchestration + verification; OC main executed specs 82/83.
