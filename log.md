# Wiki Log

*Chronological append-only record of wiki activity. Each entry starts with*
*a line matching `^## \\[` for grep-friendly parsing.*

## [2026-07-01T13:52:00Z] ops | [hermes] Profit Engine FIFO/date views/parser linkage accepted
- Closed Papi's forward-only FIFO activation request: `python scripts/profit_report.py --with-fifo` is guarded, creates an automatic DB backup before writable allocation, preserves ordinary read-only reports, and has 0 current allocations / no P&L impact because no post-boundary sales exist yet.
- Spec 161_1 date-basis views accepted by Qwen/re-review: `--basis order-date|statement-date|both` emits labeled operational and cash-reconciliation Markdown/JSON views with embedded guidance and reconciliation to accepted YTD net profit `$13,791.83`.
- Spec 161_2 parser/COGS linkage pass accepted by Qwen/re-review: aggregate-only coverage report shows 1,576/1,576 current 2026 sold items have COGS coverage; W1 parser backfill stayed dry-run only.
- Parent Spec 161 remains blocked only on Papi approval for live Google Sheet parser backfill writes, TheCanvasDon parser fix, and next linkage table/export implementation phase. Handoff: `/root/reviews/161-profit-engine-date-views-parser-cogs-linkage.md`.

## [2026-06-15T22:47:42Z] ops | [hermes] Spec 137 eBay live read-only sync verified
- Papi captured the eBay OAuth user token locally with `/root/bin/store-ebay-oauth-token`; helper status verified healthy permissions and sanitized metadata only.
- Live validation passed: `sales ebay-status --json` reported configured/valid, `sales sync-ebay --dry-run` saw 3 orders and 3 items without DB mutation, then live read-only sync wrote 3 eBay orders and 3 eBay order items locally.
- Idempotency check passed: a second `sales sync-ebay` saw 0 new orders/items; full suite remained green (`110 passed`).
- Finance events currently count 0 for the token/window; no token/client/RuName/order IDs/item titles/buyer data were logged in chat or marker files.
- Tier: hermes (live validation + closeout), prior grunt-eng/mid OC implementation/review loop retained.

## [2026-06-15T21:48:00Z] ops | [hermes] Spec 137 eBay sales connector mocked/local-ready
- Advanced approved eBay Developer work into implementation: created/dispatched `/root/tasks/137_3-ebay-sales-connector.txt`, added read-only eBay config/client/sync/schema/CLI support under `/root/sales-data`, and preserved strict secret hygiene.
- Verification: local full test suite is green (`110 passed` after the dry-run fix); `sales ebay-status --json` and `sales sync-ebay --dry-run` exit cleanly without credentials and print sanitized `not_configured` status.
- Review loop: OC `mid` initially blocked on dry-run DB mutation from schema migration; OC `grunt-eng` fixed it in `/root/tasks/137_4-ebay-dry-run-no-mutation.done`; OC `mid` acceptance review accepted `/root/reviews/137_4-ebay-dry-run-no-mutation.acceptance-review.md`.
- Current blocker: live eBay API validation still awaits secure token capture at `/root/secrets/sales/ebay.json` via `/root/bin/store-ebay-oauth-token`; no OAuth token values were pasted or logged.
- Tier: hermes (orchestration + verification), grunt-eng (implementation/fix via OC), mid (review via OC)

## [2026-06-10T20:03:15Z] plan | [hermes] Parked Bookmark Hell pipeline MVP
- Captured Papi's agreed direction for a reliable workflow-first Bookmark Hell project: Telegram/link capture before full X/TikTok scraping.
- Saved the hybrid storage preference: structured store for records, Obsidian for searchable/curated knowledge, Notion/Google Drive views later if useful.
- Documented MVP v1 categories, extraction fields, resurfacing modes, and next-session plan at `/root/obsidian-vault/system/projects/bookmark-hell-pipeline.md`.
- Next recommended work: create an `owner: hermes` spec for MVP v1 after current finance Phase 4 work or when Papi explicitly reopens the project.

## [2026-06-10T07:21:54Z] ops | [hermes] Spec 124 finance Plaid Phase 3 accepted + handoff documented
- Spec 124 Phase 3 is complete: final OpenClaw `mid` review v7 accepted `/root/reviews/124-phase3-final-mid-review-v7.md`; completion marker written at `/root/tasks/124-phase3-complete.done`.
- Finance layer now has a sandbox-first read-only Plaid connector path with strict environment gates, production hard-block, sanitized token handling, per-Item atomic sync, hashed transaction refs, liabilities rollback, and no money-movement endpoints.
- Final verification: compile pass, gate probes 7/7, Plaid live tests 83/83, smoke suite 71/71, and `/root/secrets/finance` unchanged across required test runs.
- Documented operational summary in `/root/obsidian-vault/system/configs/finance-data-layer.md`, indexed it in `system/configs/index.md`, updated `/root/finance-data/README.md`, and wrote next-session handoff `/root/context/finance-phase3-session-handoff.md`.
- Next recommended work: separate Phase 4 spec for controlled Plaid sandbox credential setup and first sandbox Item sync; no secrets in Telegram/chat and no production/real-bank linking without explicit approval.
- Tier: hermes (orchestration + final verification/documentation), grunt/grunt-eng/re-review/mid via OpenClaw review loop

## [2026-06-10] [codex] fix | Milo workout log now records Pacific dates
- Added first-class `workout_date` values derived from session start in `America/Los_Angeles` while preserving UTC timestamps and `session_id` grouping.
- Added `workout_date` columns to the live `Sets` and `Workout Sessions` tabs; backfilled all 12 existing set rows and all 13 local history records to `2026-06-07`.
- Updated history lookup and session summaries to display dates and prevent same-named sessions from merging.
- Left the existing June 7 session open because its completion status was unknown.
- Added canonical config page `system/configs/milo-fitness.md`; updated system/config indexes and corrected the resource registry to reflect live Hermes, Milo, and Mnemosyne services.
- Verification: workout self-test `34/34`, Pyright `0` errors/warnings, Sheet backfill idempotent, Milo gateway active after restart.
- Tier: codex (direct implementation + documentation)

## [2026-06-06] [hermes] ops | Spec 119 — Milo nutrition label photo OCR
- Created/owned `/root/specs/119-milo-nutrition-label-photo-ocr.md` and `/root/tasks/119-milo-nutrition-label-photo-ocr.txt`; routed to OC `lead` per Papi's quota-preservation request, not DeepSeek/grunt lanes.
- OC completed deterministic label OCR/text support in Milo nutrition: `label-text`/`label-json`, brand/product/serving preservation, high-confidence save/log gates, raw OCR/source/confidence metadata, tortilla fixture coverage, and SOUL routing for nutrition-label photos.
- Live Telegram photo was not sent as an external smoke; installed gateway media path was verified from source/runtime state. Hermes independently reran nutrition/workout self-tests and a temp-home label fixture smoke after the OC CLI exited nonzero from post-completion GPT compaction.
- Verification: nutrition self-test `48/48`, workout self-test `32/32`, fixture `Mission Carb Balance Soft Taco Flour Tortillas` with caption `ate 2` produced `140 cal / 10P / 38C / 6F / 30 fiber` in temp state.
- Tier: hermes (orchestration + review), lead (implementation via OC)

## [2026-06-06] [cc] ops | Mission Control usage cleanup + parser-review fixes + VPS housekeeping
- **VPS housekeeping**: freed ~6.2 GB of regenerable caches (npm/_cacache, uv, pip). Dispatched OC `grunt-eng` via **spec 116** to remove the stale `/root/.openclaw/session-prune-backup-20260528` (May-28 prune rollback, window closed) and empty `/root/.openclaw/trash` (~141 MB); verified real state, `_session-quarantine` left intact, `.done` written.
- **Morning reviews restyled** to a multi-line "Headline + bullets" format (✅/🔴 verdict + bullets + 🔧 Actions / 🚩 Escalations). Edited `/opt/cc-parser-review/review.prompt.md` (CC review), `/root/codex-parser-review/review.prompt.md` and `/root/scripts/parser-codex-review.sh` (Codex) — also fixed the `tr '\n' ' '` line that was flattening the Codex message into a run-on. Dated backups made.
- **Codex review scheduling reconnected**: `parser-codex-review.timer` was installed but `disabled` (left un-enabled during the Jun-3 unit rename) — `enable --now`, next run 16:40 UTC daily. Codex's `/root/.codex` ChatGPT token had 401'd (shared-auth race per [[codex-review-shared-auth-race]]); user re-authed; a manual `systemctl start` produced + sent a real review.
- **CC parser review**: its isolated token (`/opt/cc-parser-review/.claude`) had expired (401) alongside the main-session logout, so the Jun-5 scheduled run failed. Ran the review manually for 2026-06-05; user re-authed the isolated config; verified end-to-end. Removed the stale `MultiEdit` deny rule from the isolated `settings.json`.
- **Mission Control Usage tab**: investigated "OpenCode not updating" — data was correct (DeepSeek **Flash** is cheap; account-level `0/50/33` is real, confirmed against the raw opencode.ai RSC + the portal). Fixed `_merge_opencode_scrape` to attribute scraped windows to `source=opencode.ai` + fresh `as_of` (was mislabeled `openclaw-local`/stale). **Merged DeepSeek+Qwen into one "OpenCode" card** (`PROVIDER_ORDER`, new `collect_opencode`), removed "usage unknown", moved per-window source to a single card footer, added a `compact_num` Jinja filter (1.67M / 79.0k). Restarted `mission-control`; dated backups of `usage.py`/`usage.html`/`main.py`.
- Memories added: [[reference_mission_control_screenshot]] (headless-Chromium visual review workflow), [[feedback_isolated_parser_review_token]], [[project_mission_control_redesign]] (deferred sleeker UI).
- Tier: cc (orchestration + direct ops/config), grunt-eng (spec 116 cleanup via OC)

## [2026-06-06] [hermes] ops | Spec 115 — Mnemo Google Tasks visibility
- Created `/root/specs/115-mnemo-google-tasks-brief.md` and `/root/tasks/115-mnemo-google-tasks-brief.txt` with `owner: hermes`.
- Delegated implementation to OC `grunt-eng`: added read-only Google Tasks CLI support to the Hermes Google Workspace helper, added `tasks.readonly` to OAuth scope lists, and updated Mnemo daily command stack cron job `0d108b2bb0c2` to include Google Tasks.
- Updated `/root/obsidian-vault/system/configs/mnemosyne-pa.md` documenting Google Tasks visibility and re-auth requirements.
- Verification: Python compile passed; cron prompt contains Google Tasks instructions. Follow-up user re-auth completed for both account-scoped tokens, and live read-only Google Tasks API smoke checks succeeded for `mramirez021111` and `themetalman13`.
- Tier: hermes (orchestration + review), grunt-eng (implementation via OC)

## [2026-06-05] [hermes] ops | Specs 113-114 — Mnemosyne quick-capture + due dispatcher
- Created shared specs/tasks for Mnemosyne's deterministic PA layer: `/root/specs/113-mnemo-quick-capture-kernel.md`, `/root/tasks/113-mnemo-quick-capture-kernel.txt`, `/root/specs/114-mnemo-due-dispatcher.md`, `/root/tasks/114-mnemo-due-dispatcher.txt`.
- Delegated bounded implementation to OC `grunt-eng` per cost-control hierarchy; Hermes/Janus independently reviewed and sent two corrective passes for `OVERWHELMED` reply formatting and `oil change` phrase preservation.
- Installed quick-capture helper `/root/.hermes/profiles/papipa/pa/bin/mnemo.py` plus `/root/.hermes/profiles/papipa/pa/README.md`; updated `/root/.hermes/profiles/papipa/SOUL.md` to call the helper for `ADD`, `PARK`, `WAITING ON`, `REMIND`, `DONE`, `LIST`, and `OVERWHELMED`.
- Installed dispatcher `/root/.hermes/profiles/papipa/scripts/mnemo-due-dispatch.py`; scheduled cron job `cbcef468213a` (`Mnemosyne Due Reminder Dispatcher`) every 5 minutes under profile `papipa`, script-only/no-agent, Telegram delivery, silent when no due items.
- Added shared config doc `/root/obsidian-vault/system/configs/mnemosyne-pa.md` documenting profile, state files, helper commands, cron jobs, and maintenance notes.
- Verification: `py_compile`, helper `--help`, ADD/PARK/WAITING/REMIND/OVERWHELMED captures, list counts, future `due`, dispatcher no-due silence, dispatcher due-output fixture, and final PA state restored to empty arrays/empty JSONL.
- Tier: hermes (orchestration + review + cron scheduling), grunt-eng (implementation via OC)

## [2026-06-04] [hermes] ops | Spec 112 — OpenClaw grunt session maintenance watchdog
- Created `/root/specs/112-openclaw-grunt-session-maintenance.md` and `/root/tasks/112-openclaw-grunt-session-maintenance.txt` with `owner: hermes`.
- Added guarded maintenance script `/root/bin/openclaw-grunt-session-maintenance.py` for `grunt` and `grunt-eng` session stores. It defaults to dry-run, supports JSON output, archives before reset, resets `sessions.json` and `.usage-cost-cache.json`, leaves archives untouched, and refuses rotate when targeted OpenClaw tasks are running or fresh `.progress` markers exist.
- Added silent Hermes cron watchdog `/root/.hermes/scripts/openclaw-grunt-session-watchdog.py`, scheduled every 6h as cron job `eac51421f32b`; it emits no output when stores are healthy and alerts only on threshold/check failures.
- Corrected routing guidance: OpenClaw's OpenAI account is separate from Hermes/Janus's account, so OpenClaw GPT rolling-window exhaustion does not block Hermes. Janus delegation reasoning set to `low` for low/medium GPT subagent work while Janus remains high-reasoning orchestration.
- Verification: script `--help`, `python3 -m py_compile`, live `--dry-run --json`, temp-fixture rotate/reset/archive test, watchdog silent-success run.
- Tier: hermes (orchestration + review), Hermes delegated worker (implementation)

## [2026-06-04] [hermes] ops | Purchase log cleanup + parser hardening batch (specs 96-100)
- **Master row 2 (SUPCASE)**: removed via source-sheet deletion + master refresh. Backup `/root/backups/purchase-log-cleanup/20260604T075620Z/`.
- **Target row 9 correction**: blank item name `Monster High Skulltimate Secrets Gore-geous Oasis Playset, Draculaura Doll and Accessories` (90 chars) filled. Order number `102003482248229` (was misparsed as `#8199` from HTML entities). Tracking `TLMD2256A0025527` filled from delivery email. Status `Delivered`. Source row updated, master refreshed.
- **Target back-to-back orders**: missing order `912003091776786` (placed same day as `102003482248229`) appended to source sheet row 13. Both now in master rows 8-9. Backup `/root/backups/purchase-log-cleanup/20260604T080949Z/`.
- **eBay item-name standardization (spec 98)**: 21 source-sheet cells updated — Eevee rows standardized to `Pokémon TCG Eevee GX SM233`, Alakazam eBay rows to `Pokémon TCG: Scarlet & Violet 151 Alakazam ex Boxes`. Canonicalization function added to parser. Backup `/root/backups/purchase-log-cleanup/20260604T083141Z/`.
- **eBay cart split (spec 99)**: master line 20 was one aggregate row lumping seven eBay cart orders into `Pokémon 151 Boxes (15 items)` with ellipsis order `23-14553-12086...`. Gmail review confirmed seven separate order numbers from one cart checkout. Replaced with seven exact rows in source, master now has rows 20-26. Order `23-14553-12090` marked Cancelled (seller out of stock / refunded). Split prices allocated proportionally to charged total `$2,217.26`. Backup `/root/backups/purchase-log-cleanup/20260604T084131Z/`.
- **eBay parser follow-up (spec 100)**: Hermes review caught weak regression tests — test was passing despite wrong price/qty extraction (candidate 1 grabbed cart total, candidate 2 leaked neighbor qty). OpenClaw strengthened assertions + fixed per-block extraction. Hermes then caught and fixed Target multi-order regression introduced by the eBay block-slicing change — `extractCandidateRegexes` now branches by retailer (Target: current→next; eBay: prev→current). All 7 parser tests + 3 fixtures green.
- **Parser changes across all five specs**:
  - `extractTargetItemName()`: handles link-heavy compact text, extracts product name before `Qty:`, ignores HTML entity noise
  - `canonicalizeEbayItemName()`: eBay + eevee/SM233 → canonical Eevee name; eBay + alakazam → canonical Alakazam name
  - `collectOrderNumberMatches()`: added `target_order` pattern (`Order #\d{13,18}`) to avoid short-hash false positives
  - `extractCandidateRegexes()`: per-retailer block slicing (Target forward, eBay backward); first eBay block preamble trimmed; Price: prioritized over cart total/subtotal
  - Item name length threshold raised to 120 chars (was 80)
- **OpenClaw delegation**: three tasks (98, 99, 100) were delegated to `grunt-eng` due to Codex quota at 23%. Hermes acted as orchestrator/reviewer and caught two issues during independent verification (weak test assertions in 100, Target multi-order regression from eBay change).
- **Regression tests added**: `test_target_order_extraction.js`, `test_target_multi_order_blocks.js`, `test_ebay_item_canonicalization.js`, `test_ebay_cart_multi_order_split.js`
- Tier: hermes (orchestration + review), grunt-eng (implementation via OC)

## [2026-06-04] [hermes] ops | Tailscale dashboard access shakedown follow-up
- Retrospective log correction: Hermes completed a dashboard-access task in Telegram without first creating a shared spec/task record, so this entry records the final verified state for peer visibility.
- Hermes dashboard is systemd-supervised as `hermes-dashboard.service`, bound to `127.0.0.1:9119`, proxied by local Caddy adapter `127.0.0.1:9120`, and exposed tailnet-only at `https://papi-hermes-vps.tail9ba0f0.ts.net:9120/`.
- OpenClaw Control is loopback-bound and exposed tailnet-only at `https://papi-hermes-vps.tail9ba0f0.ts.net:18789/openclaw/`; public UFW allow for `18789/tcp` was removed.
- Mission Control is loopback-bound at `127.0.0.1:5003` and exposed tailnet-only; the dashboard requires `/d/<url-token>/`, while bare `/` intentionally returns 404 and `/healthz` returns `ok`.
- Follow-up governance note: future Hermes operational work should create `owner: hermes` specs/tasks before dispatch or implementation, and every shared-vault log entry must include `[hermes]` in the header.
- Tier: hermes (direct ops, retrospective log)

## [2026-06-03] [hermes] ops | Spec 90 — Hermes shakedown completed
- Hermes authored `/root/specs/90-hermes-shakedown.md` + `/root/tasks/90-hermes-shakedown.txt` with `owner: hermes`.
- Dispatched OC `grunt` (`opencode-go/deepseek-v4-pro`) to fix the peer-protocol owner-values doc nit; `.done` marker verified at `/root/tasks/90-hermes-shakedown.done`.
- Protocol now consistently lists valid `owner:` values as `cc`, `codex`, and `hermes`.
- Separately verified Hermes gateway is systemd-supervised, disabled inherited Alfred Telegram token in Hermes `.env`, and set Hermes fallback chain to DeepSeek V4 Pro via `opencode-go`.
- Tier: hermes (orchestration), grunt (docs)

## [2026-06-02] [cc] ops | Task reconciliation + Hermes onboarded as 3rd peer orchestrator
- Closed stale tasks (user-approved): **67-telegram-pa-profile → done** (pa agent confirmed live; only the old vault-commit step had blocked it); **50_4-order-parser-verify-and-extend → superseded** by specs 70-89; **51-n8n-remote-access → superseded** by spec 52 (Caddy HTTPS). Original blockers kept as `.blocked.resolved`.
- **67-master-live-mirror** left BLOCKED — awaiting user manual "Allow access" on Master L1/L3; user unsure the sheet is still in use.
- **Hermes** (Nous Hermes harness) added as a third peer orchestrator alongside CC + Codex. It had been loading `/root/AGENTS.md` and impersonating Codex; fixed by authoring `/root/.hermes.md` (Hermes prioritizes `.hermes.md` and skips `AGENTS.md`). Added `owner: hermes` + `[hermes]` log tag to the peer protocol; `/root/.hermes/` marked private.
- Hermes runs `gpt-5.5` via `openai-codex` on a **separate ChatGPT account** from Codex (no quota contention). Source-of-truth: Hermes kanban is private working memory; shared `/root/specs|tasks|reviews` stay canonical.
- Pending next: **68-telegram-pa-smoke-test**.
- Tier: cc (orchestration only)

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

## [2026-06-01] [cc] verify+fix | Spec 84 confirm + Spec 89 daily-run msgId guard + OC main reset
- Spec 84 (gated dispatch) confirmed: 05-30 16:30 timer ran clean → dispatched spec 84;
  OC wrote .done; one-shot unit self-cleaned. Verified against LIVE sheet (not the .done):
  cleared cells stayed blank, legit Eevee bundle preserved, master/A:I intact.
- Found a RECURRENCE in the daily-run path: msgId 19e79f952eb6531c stamped on both Target
  #8199 and Amazon 111-0134108-2665821. Root cause (confirmed by re-fetching the email):
  Amazon "Ordered: …" emails use repeated `&#8199;` HTML figure-space spacer entities; the
  short-hash matcher read `#8199` inside `&#8199;` as Target order #8199 and overwrote J.
  Spec 84's substring containment missed it (the substring was literally present).
- Spec 89 (DONE/verified): guard in order_parser.js — (1) `isHtmlEntityHashMatch` skips
  `#NNNN` shaped like `&#NNNN;`; (2) matches tagged strong/short_hash + subjectAnchored +
  weak; (3) `orderMatchCorroboration` requires subject-anchor OR retailer/sender consistency
  before a weak short-# token may overwrite an EXISTING row (daily-run hit + cleanup audit).
  Cleared account_a J2 (#8199); kept #37457105 via retailer corroboration (no over-block).
  Backup order_parser.js.bak-20260601T224619Z-spec89. Invariant holds: only genuine
  same-retailer bundles share a msgId. Row counts unchanged (a17/b31); exactly one J cell
  changed. Verified by CC: node --check, 8/8 unit test on real fns, live-sheet diff.
- Dispatch lesson: `openclaw agent --local` returned empty stdout + nonzero exit DESPITE
  success; OC `main`'s codex app-server processed the first dispatch async after the CLI
  returned — likely the true author of the spec-89 implementation. Don't infer failure
  from empty output; don't reroute prematurely (double-execution risk). New memory saved.
- OC `main` session reset: `agent:main:main` was bloated (168k tokens, May-26 checkpoints).
  Backed up sessions.json, removed only that key, quarantined the 13MB `2fb4742c…` lineage
  to `.openclaw/_session-quarantine/main-mainlocal-20260601T231628Z/`. Fresh session
  5020da67 on gpt-5.5 verified responsive (~60k baseline). Telegram session preserved.
- Parser code + sheets are NOT vault; signoff in reviews/89-parser-daily-run-msgid-guard-
  signoff.md (+ diagnosis, decisions). This log entry is the only vault write.
- Tier: CC orchestration + heavy independent verification; OC main/lead (gpt-5.5) executed.

## [2026-06-02] [cc] feature | Mission Control MVP
- Mission Control MVP shipped: Flask read-only cockpit over agents/tasks/blockers/schedules/search.
- Binds `127.0.0.1:5003`, token-protected (token at `/root/secrets/mission-control/url-token.txt`, mode 0600).
- Local-only; no write actions; no public route yet. Vault remains canonical; MC derives views.
- Specs 85–86 (codex-led scaffold + MVP pages), spec 87 (service hardening + smoke test), spec 88 (vault docs).
- CC closed out the review chain + dispatched 87/88 while codex was quota-limited (quota reset ~03:39Z).
- See `system/projects/mission-control.md` for paths, data sources, and future backlog.

## [2026-06-04] [cc] maint+feature | Parser review-job cleanup, FP fix, self-improvement loop P1; Hermes readiness review
- Hermes readiness review (advisory): install current, gateway daemon up, `.hermes.md` strong;
  gaps = gateway not systemd-supervised + no real track record. User is testing Hermes by having
  HIM implement the recommendations; CC = final reviewer of the result.
- Parser review jobs (specs 90/90_1): dropped misleading `n8n-` prefix. Now TWO active reviews —
  `parser-daily-audit` (OC cron 09:20 PT) + `parser-cc-review` (systemd 09:35 PT, renamed+enabled);
  `parser-codex-review` (09:40) disabled (units kept). Parser itself = single `order-parser` timer 09:00.
- Parser FP fix (spec 91): excluded `capitaloneshopping.com` + `em.pokemon.com` (over-block guard
  confirms eBay/Mercari/pokemoncenter.com safe); removed 2 stale FP rows from account_a (master
  self-heals); seeded 3 regression fixtures. Required explicit user auth for ledger/parser edits.
- Self-improvement loop (spec 92 ROADMAP, L2 human-gated): P1 DONE (spec 94) = fixture harness +
  `require.main` guard + `module.exports`; `fixtures-run.sh` green 3/3. P2 (proposal step) is next.
- Spec 93: CC-review dry-run repointed docker-exec → host node.
- CORRECTION (carry forward): the order parser is FULLY decoupled from n8n at runtime (host node +
  /root/secrets creds). n8n is kept up ONLY for the Google Tasks↔Notion hourly sync; it can be
  decommissioned if that sync is migrated.
- Vault writes: this log entry + spec 93's runbook/cron-name fix (commit 01a14c7). Parser code +
  sheets are NOT vault. Full record: reviews/session-2026-06-04-handoff.md + signoffs 91, 93-94.
- [cc] Documented spec-92 L2 self-improvement loop + weekly KPI timer in system/projects/n8n-order-parser.md (spec 92 P4 follow-up B).

## [2026-06-04] [cc] feature | On-demand Master refresh; spec 67 superseded
- Shipped `/root/scripts/refresh-master.sh` for host-node Master rebuilds on demand, with
  Telegram confirmation to Manny showing account_a/account_b/output/dedup row counts.
- Wired OC main's known-command instructions for `refresh master`, `update master`, and
  `rebuild master now`; caveat is one OpenClaw main agent turn plus script runtime.
- Cleaned spec-67 Master leftovers by snapshotting `A:L` and clearing only `L1` and `L3`;
  verified `A:J` unchanged. Live IMPORTRANGE mirror remains abandoned because it conflicts
  with the daily clear+rewrite rebuild.
- Daily `order-parser.timer` remains enabled at 09:00 America/Los_Angeles.
- [cc] Audit recall step now honors parser exclusions via --exclude-parser-rejects flag (spec 102). Filter script: /root/scripts/filter-parser-excluded.js. Runbook §2 updated.
- [cc] Session summary (2026-06-04, specs 101/102/103/103b/104): synced parser audit hardening and Walmart Marketplace docs into the vault. Spec 101 fixed unattended `parser-cc-review.timer` delivery and allowlist drift; spec 102 made audit recall honor parser exclusions via `/root/scripts/filter-parser-excluded.js` and `--exclude-parser-rejects`; spec 103 added Walmart Marketplace extraction and fixtures; 103b verified/pruned the personal CONCETTA account_a/master row state; spec 104 updated the parser project and resource registry docs.


## [2026-06-04T22:57:29Z] [hermes] ops | OpenClaw grunt lanes moved to DeepSeek V4 Flash
- Updated live OpenClaw config so `grunt` and `grunt-eng` default to `opencode-go/deepseek-v4-flash` instead of DeepSeek V4 Pro.
- Rotated old bloated `grunt`/`grunt-eng` session stores into timestamped archives and reset their session indexes/cost caches.
- Updated shared agent docs/cheatsheets to document Flash as the cost-control default and Pro/`mid` as escalation paths.
- 2026-06-04 [feature] [cc] Mission Control usage tracker added (specs 105-110):
  Anthropic and OpenAI auto, DeepSeek/Qwen opencode scrape plus local signals,
  Gemini manual; 5-min refresh timer.

## [2026-06-06T05:06:10Z] task | [hermes] Spec 118 Milo nutrition activation
- Orchestrated OC research, local nutrition kernel, Sheet integration, Telegram routing, and re-review.
- Verified nutrition self-test 36/36, workout self-test 32/32, Sheet smoke/cleanup, and activation re-review PASS.

---
## [2026-06-06T05:19:18Z] task | [hermes] Spec 119 Milo nutrition label photo OCR dispatched to OpenClaw Lead
- User requested Hermes quota preservation: route everything to OpenClaw Main/Lead for now.
- Created `/root/specs/119-milo-nutrition-label-photo-ocr.md` and `/root/tasks/119-milo-nutrition-label-photo-ocr.txt`.
- Scope: precise packaged-food nutrition label photo/OCR flow for Milo, preserving brand/product line/serving macros and avoiding generic food estimates.

## [2026-06-08T23:41:23Z] task | [hermes] Spec 120 CC parser review Telegram digest formatting
- User asked to make the daily CC parser review Telegram easier to digest.
- Created `/root/specs/120-cc-parser-review-tg-digest-format.md` and `/root/tasks/120-cc-parser-review-tg-digest-format.txt`.
- Scope: prompt/formatting only for `/opt/cc-parser-review/review.prompt.md`; no parser code, sheets, credentials, or cron changes.

## [2026-06-08T23:51:57Z] task | [hermes] Spec 121 parser blank-order shipment repair dispatched
- User approved steps 1-4: parser fix, account_b sheet cleanup, snapshot/audit alignment, and verification.
- Created `/root/specs/121-parser-blank-order-shipment-repair.md` and `/root/tasks/121-parser-blank-order-shipment-repair.txt`.
- Dispatch target: OpenClaw `grunt-eng`; step 5 (`mramirez` re-auth) remains out of scope until user/Janus handle it later.

## [2026-06-09T00:08:50Z] task | [hermes] Spec 121 parser blank-order shipment repair accepted
- OpenClaw `grunt-eng` completed parser fix, account_b sheet cleanup, parser snapshot blank-order metrics, and verification.
- Hermes verified live account_b: 35 rows, 0 blank-order rows, 0 duplicate order groups; row 14 updated, row 37 no longer returned.
- Hermes caught one safety gap in blank-order fallback tracking matching; OC follow-up tightened it to reject different nonblank tracking values.
- Re-review and mid final review accepted with no required fixes. Ready for separate `mramirez` re-auth task.

## [2026-06-10T00:43:34Z] task | [hermes] Spec 122 secure business finance data layer dispatched
- User asked to build a secure finance data layer for Chase Business Checking cash and Amex/Chase card analysis; Plaid already connected to Chase and possibly Amex.
- Created `/root/specs/122-secure-business-finance-data-layer.md` with strict read-only/no-payment/no-secret-in-prompts boundaries.
- Dispatched Phase 1 tasks: `122_1` to OpenClaw lead for source/security architecture, `122_2` to grunt-eng for local SQLite/CLI scaffold, and `122_3` to grunt for ADHD-friendly setup/runbook docs.
- Next: wait for `.done` markers, run re-review/mid review chain for grunt outputs, then Hermes verifies before Phase 2 Plaid integration.

## [2026-06-10T01:21:16Z] task | [hermes] Spec 122 finance data layer Phase 1 accepted

Hermes dispatched and reviewed Spec 122 secure business finance data layer Phase 1. OC outputs created `/root/finance-data/` local read-only scaffold, CSV import, sanitized JSON commands, v0 optimizer, Plaid placeholder, and user runbook. Re-review + mid review initially found blockers; Hermes dispatched code/runbook fixes. Final mid review ACCEPTED with smoke test 22 passed / 0 failed and default finance DB empty. Phase 2 should add strict Plaid secret loader, Link/token flow, mocked Plaid adapters, account sync, per-account audit enrichment, and no payment/write features.


## [2026-06-10T03:06:31Z] note | [cc] Session Q&A: Hermes dashboard access path + Purchase Log Master source clarification

Two reference findings from a CC orchestrator Q&A session (no implementation; diagnostics only).

**1. Hermes dashboard access.** User couldn't reach `http://127.0.0.1:9119/` after a restart/update — nothing was actually broken. `hermes-dashboard.service` is healthy and binds **loopback-only** (`--host 127.0.0.1 --port 9119`) by design. The correct external path:
`https://papi-hermes-vps.tail9ba0f0.ts.net:9120/`
Chain: browser → Tailscale Serve (HTTPS, tailnet-only) → Caddy `:9120` reverse_proxy → dashboard `127.0.0.1:9119`. Gotchas: (a) `127.0.0.1:9119` from a laptop hits the laptop, not the VPS — needs an SSH tunnel `ssh -N -L 9119:127.0.0.1:9119 root@...`; (b) port 9120 over Tailscale speaks **HTTPS only** (Serve), so `http://` returns "Client sent an HTTP request to an HTTPS server" — must use `https://` and the `*.ts.net` hostname (raw IP won't match the cert). Diagnosed without touching Hermes private state.

**2. Purchase Log – Master source sheets.** Confirmed the Master is a **derived/output** spreadsheet, NOT its own source, even though account A's Google account owns both. `order_parser.js runMaster()` reads two separate source sheets, dedupes, then `A:J:clear` + rewrites Master. Three distinct sheet IDs:
- account_a source: `1y1JXLFX0wUQuYrEfami6Z6yFE56Gl9yTpPEUWgIvkGU`
- account_b source (eBay; A has shared read): `1ZJ1BVOItFstSVCN5oxuYC6JfcSUsi5SsOxBZr7g87Y0`
- master (output): `1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`
Implication: edits to the account_a source propagate into Master on the next rebuild (daily 09:00 PT timer or instant "refresh master"); edits made directly in Master are wiped on the next rebuild.

## [2026-06-10T09:10:00Z] task | [cc] Full VPS audit + hardening sweep (Fable 5 test drive)

CC (Metis) ran a total scan of all projects, agents, automations, and dashboards. Report: `/root/reviews/vps-audit-2026-06-10.md`.

**Healthy:** all services/timers green, parser pipeline + reviews clean, vault synced, OC fleet matches roster, disk 16%.

**Fixed during audit (CC direct):** parent `.done` markers for completed specs 92/124; archived 485 completed artifacts ≤110 to `/root/archive/sweep-2026-06-10/` (specs 158→28, tasks 699→346); corrected CC's stale local memory (grunt agents are deepseek-v4-flash per 2026-06-06 rotation).

**Dispatched + accepted (grunt-eng, verified by CC against artifacts):**
- Spec 125 — all 7 production dirs now local git repos (orders-dashboard, mission-control, metis-gateway, codex-parser-review, scripts, systemd, order-parser), 1 clean initial commit each, zero secret-pattern files tracked.
- Spec 126 — `/root/scripts/nightly-backup.sh` + staged units in `/root/systemd/` (NOT installed); verification snapshot passed integrity checks (3 SQLite DBs + configs/secrets tar, n8n-postgres gated behind install approval). Review chain worked as designed: re-review ACCEPT, mid BLOCKED on two real issues (unit allowlist missed 4 units; --ignore-failed-read could mask incomplete archives), grunt-eng fixed (126b), CC re-verified, mid v2 signoff. Artifacts committed to the new scripts/systemd repos.

**Awaiting user approval (permission-gated infra):** drop stale ufw 5001 rule; disable two spent timers; install nightly-backup timer; spec 127 (orders-dashboard behind Tailscale, close public 5002) written but NOT dispatched.

**Proposed new projects (specs, status: proposed):** 128 Papi Daily Brief, 129 Profit Engine (COGS/margin), 130 VPS Watchdog alerts, 131 Receipt & Expense Snap. Sent to user via Telegram.

## [2026-06-11T20:20:00Z] ops | [hermes] Spec 130 finance Phase 4 sandbox activation accepted + handoff documented
- Spec 130 Phase 4 completed and final-mid accepted at `/root/reviews/130-finance-phase4-sandbox-activation-final-mid-review-2.md`.
- Plaid Sandbox sync is live: `configured=true`, `config_valid=true`, `environment=sandbox`, `environment_gate=allowed`, `item_count=2`, `sync_ready=true`.
- DB populated: schema version 4, 1 institution, 12 accounts, 12 balances, 100 transactions, 2 sync-state records, 0 liabilities.
- Cash account intentionally unset (accepted safe blocker): sandbox institution labels were generic/ambiguous with no confirmed Chase/JP Morgan provenance.
- Targeted tests: 89 passed (test_plaid_live + test_gate_before_client). Compatibility patch: `initial_products` for sandbox public-token create.
- Documented Phase 4 state in `/root/finance-data/README.md`, `/root/obsidian-vault/system/configs/finance-data-layer.md`, `/root/specs/130-finance-phase4-sandbox-activation.md`, and created next-session handoff at `/root/context/finance-phase4-session-handoff.md`.
- Next recommended phase: Phase 5 real Plaid Link / production-readiness (read-only, explicit human approval, Papi connects each account). No money movement, no autopay. Cash account must not be set until a verified Chase/JP Morgan depository checking Item exists.

## [2026-06-11T22:37:48Z] task | [hermes] Spec 135 Milo nutrition required-fields gate approved/dispatched
- Papi approved smart Pacific-date defaulting, strict explicit meal type, preview-before-write for best-judgment estimates, and compact checklist clarification.
- Updated `/root/specs/135-milo-nutrition-required-fields-gate.md` and `/root/tasks/135-milo-nutrition-required-fields-gate.txt`.
- Dispatch target: OpenClaw `mid`; implementation must add pre-write validation so Milo does not mutate nutrition logs when date/meal/item/quantity/source are missing or ambiguous.

## [2026-06-11T23:05:49Z] task | [hermes] spec 135 Milo nutrition required-fields gate approved
- Reviewed OpenClaw mid implementation for `/root/specs/135-milo-nutrition-required-fields-gate.md`.
- Requested and dispatched follow-up fixes for natural meal-prefix logging and `late dinner:` normalization.
- Verified nutrition self-test 61/61, workout self-test 34/34, py_compile, temp-home regressions, and zero invalid live meal types.
- Final review: `/root/reviews/135-milo-nutrition-required-fields-gate.hermes-final-review.md`.

## [2026-06-11T23:27:31Z] ops | [hermes] Spec 136 OpenClaw DeepSeek Pro routing applied
- Papi requested one DeepSeek Flash lane for basic execution and one DeepSeek Pro lane for anything slightly complex.
- Updated live OpenClaw config: `grunt` remains `opencode-go/deepseek-v4-flash`; `grunt-eng` now uses `opencode-go/deepseek-v4-pro`; `re-review` remains `opencode-go/qwen3.6-plus`.
- Updated review policy: Qwen re-review remains first-pass over DeepSeek work; medium-to-high-level or important work should also get OC GPT `mid`/`lead` review when quota allows.
- Updated shared docs: `/root/obsidian-vault/system/configs/openclaw-agents.md` and `/root/obsidian-vault/system/cheatsheets/oc-cli.md`.

## [2026-06-11T23:48:31Z] ops | [hermes] Metis exit-143 check + hardening

Papi reported Metis Telegram returned `Command failed with exit code 143`. Checked `metis-gateway.service`: gateway daemon was active; error came from Claude SDK `receive_response()` after its subprocess was SIGTERM'd. Restarted service to clear state. Dispatched Spec 137 to `grunt-eng` (DeepSeek Pro), Qwen re-review initially BLOCKED because the SDK raised a bare `Exception`; follow-up fix added generic text-pattern handling for exit 143/SIGTERM. Verified py_compile, service active, clean journal, local simulated bare exception, and Qwen ACCEPT. Review: `/root/reviews/137-metis-exit-143-hardening-review.md`.


## [2026-06-11T23:55:59Z] ops | [hermes] Session handoff documented

Papi asked to document before a new session. Wrote detailed handoff to `/root/reviews/session-2026-06-11-hermes-handoff.md` and concise context note to `/root/context/hermes-session-handoff-2026-06-11.md`. Captured OC GPT hold until 19:31 PT, DeepSeek Flash/Pro routing, Qwen/GPT review policy, Metis exit-143 hardening status, Milo nutrition gate completion, finance blockers, pending candidate specs, and stale progress-marker cleanup. Removed stale `.progress` markers for completed specs 117, 127, 135, and 135_1; left old usage-tracker progress markers untouched.

## [2026-06-12T00:09:21Z] task | [hermes] Spec 138 Google OAuth scope preservation dispatched

Papi asked to spec and dispatch the mramirez021111 Google OAuth scope-preservation fix, explicitly covering all agents/automations and not only Milo. Created `/root/specs/138-google-oauth-scope-preservation.md` and `/root/tasks/138-google-oauth-scope-preservation.txt`. Current diagnosis: shared token is Sheets-only/partial, Calendar and Tasks fail with insufficient scopes, and Milo nutrition/workout still have Sheets-only refresh/write-back risk. Dispatch target is OpenClaw `grunt-eng` (DeepSeek Pro) while OC GPT is unavailable; Qwen `re-review` is required before acceptance, with GPT review deferred until available if risk remains.

## [2026-06-15T08:02:47Z] task | [hermes] Spec 137 eBay account-deletion endpoint dispatched
- Papi explicitly reassigned Spec 137 to Hermes after eBay Developer approval and Production keyset blockage on Marketplace Account Deletion/Closure notifications.
- Updated `/root/specs/137-ebay-sales-connector.md` owner to `hermes` and split current work into Scope A endpoint unblocker before Scope B read-only sales connector.
- Created `/root/tasks/137_1-ebay-account-deletion-endpoint.txt` for OpenClaw `grunt-eng`: public endpoint `https://n8n.rareforceone.cloud/ebay/account-deletion`, tailnet-only setup page, root-only token storage, Caddy preservation, verification, and no secret leakage.

## [2026-06-15T08:27:20Z] completed | [hermes] Spec 137 eBay deletion endpoint ready

- Reassigned spec 137 to Hermes.
- Dispatched OpenClaw grunt-eng to wire eBay Marketplace Account Deletion endpoint.
- Mid review initially rejected two blockers; grunt-eng fixed exact public route + POST DoS hardening.
- Final mid review APPROVED `/root/reviews/137_1-ebay-account-deletion-endpoint.final-review.md`.
- Papi next action: enter public endpoint `https://n8n.rareforceone.cloud/ebay/account-deletion` and copy verification token from tailnet setup page.

## [2026-06-15T20:46:36Z] in-progress | [hermes] Spec 137 eBay OAuth token capture helper

- Papi has eBay Developer OAuth user token ready.
- Created `/root/tasks/137_2-ebay-oauth-secret-capture.txt` for OC grunt-eng.
- Goal: local SSH helper to write `/root/secrets/sales/ebay.json` without token leakage in chat/history/output.

## [2026-06-15T20:48:49Z] completed | [hermes] Spec 137 eBay OAuth token capture helper ready

- OC grunt-eng created `/root/bin/store-ebay-oauth-token` for secure local capture of Papi's eBay OAuth user token into `/root/secrets/sales/ebay.json`.
- Hermes patched sanitizer to avoid revealing any token prefix; status/confirmation now prints only `[REDACTED] (len N)` and metadata counts/presence.
- Verified py_compile and `--status`; no real eBay token file exists yet.
- Papi next action: SSH to VPS and run `/root/bin/store-ebay-oauth-token`, then `/root/bin/store-ebay-oauth-token --status`.

## [2026-06-15T21:23:00Z] in-progress | [hermes] Spec 137 Scope B eBay connector dispatched

- Papi reports eBay approval is complete; Hermes verified no `/root/secrets/sales/ebay.json` exists yet.
- Created `/root/tasks/137_3-ebay-sales-connector.txt` for OC grunt-eng.
- Scope: add mock-tested read-only eBay connector to `/root/sales-data` with strict secret loader, `sales ebay-status`, `sales sync-ebay`, idempotent schema, no PII, no secret leakage.

## [2026-06-16T00:01:25Z] project | [hermes] Spec 139 Option A COGS SaaS bridge built
- Created Hermes-owned Spec 139 for Profit Engine Option A: local canonical profit engine + SaaS bridge for BoxEm/Sellerboard.
- Dispatched OC strategy, implementation, Qwen re-review, and follow-up fixes through shared task files.
- Built /root/sales-data COGS importer for Sellerboard/BoxEm/manual-template CSV/XLSX with provenance, validation, dry-run, duplicate detection, and query CLI.
- Installed documented Python dependency via /root/sales-data/requirements.txt and verified ........................................................................ [ 28%]
........................................................................ [ 57%]
........................................................................ [ 86%]
..................................                                       [100%]
=============================== warnings summary ===============================
finance-data/tests/test_gate_before_client.py::test_sync_plaid_live_development_no_allow
  /usr/local/lib/hermes-agent/venv/lib/python3.11/site-packages/_pytest/python.py:170: PytestReturnNotNoneWarning: Test functions should return None, but finance-data/tests/test_gate_before_client.py::test_sync_plaid_live_development_no_allow returned <class 'bool'>.
  Did you mean to use `assert` instead of `return`?
  See https://docs.pytest.org/en/stable/how-to/assert.html#return-not-none for more information.
    warnings.warn(

finance-data/tests/test_gate_before_client.py::test_link_token_development_no_allow
  /usr/local/lib/hermes-agent/venv/lib/python3.11/site-packages/_pytest/python.py:170: PytestReturnNotNoneWarning: Test functions should return None, but finance-data/tests/test_gate_before_client.py::test_link_token_development_no_allow returned <class 'bool'>.
  Did you mean to use `assert` instead of `return`?
  See https://docs.pytest.org/en/stable/how-to/assert.html#return-not-none for more information.
    warnings.warn(

finance-data/tests/test_gate_before_client.py::test_exchange_public_token_development_no_allow
  /usr/local/lib/hermes-agent/venv/lib/python3.11/site-packages/_pytest/python.py:170: PytestReturnNotNoneWarning: Test functions should return None, but finance-data/tests/test_gate_before_client.py::test_exchange_public_token_development_no_allow returned <class 'bool'>.
  Did you mean to use `assert` instead of `return`?
  See https://docs.pytest.org/en/stable/how-to/assert.html#return-not-none for more information.
    warnings.warn(

finance-data/tests/test_gate_before_client.py::test_items_refresh_development_no_allow
  /usr/local/lib/hermes-agent/venv/lib/python3.11/site-packages/_pytest/python.py:170: PytestReturnNotNoneWarning: Test functions should return None, but finance-data/tests/test_gate_before_client.py::test_items_refresh_development_no_allow returned <class 'bool'>.
  Did you mean to use `assert` instead of `return`?
  See https://docs.pytest.org/en/stable/how-to/assert.html#return-not-none for more information.
    warnings.warn(

finance-data/tests/test_gate_before_client.py::test_production_blocked_without_both_allow_flags
  /usr/local/lib/hermes-agent/venv/lib/python3.11/site-packages/_pytest/python.py:170: PytestReturnNotNoneWarning: Test functions should return None, but finance-data/tests/test_gate_before_client.py::test_production_blocked_without_both_allow_flags returned <class 'bool'>.
  Did you mean to use `assert` instead of `return`?
  See https://docs.pytest.org/en/stable/how-to/assert.html#return-not-none for more information.
    warnings.warn(

finance-data/tests/test_gate_before_client.py::test_sandbox_allowed
  /usr/local/lib/hermes-agent/venv/lib/python3.11/site-packages/_pytest/python.py:170: PytestReturnNotNoneWarning: Test functions should return None, but finance-data/tests/test_gate_before_client.py::test_sandbox_allowed returned <class 'bool'>.
  Did you mean to use `assert` instead of `return`?
  See https://docs.pytest.org/en/stable/how-to/assert.html#return-not-none for more information.
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
250 passed, 6 warnings in 15.65s => 146 passed in 25.40s.
- Dry-run verification parsed Sellerboard and BoxEm fixtures without mutating production COGS tables; current production COGS import counts remain zero pending Papi-provided exports.

## [2026-06-16T00:26:00Z] project | [hermes] Spec 139 pinned with handoff
- Created /root/context/139-profit-engine-cogs-bridge-handoff.md so Profit Engine Option A / Sellerboard-BoxEm COGS bridge can be resumed later without chat context.
- Current state: importer built and verified; no real SaaS COGS export imported yet; next user action is Sellerboard or BoxEm export discovery/upload.

## [2026-06-16T01:31:37Z] project | [hermes] Sellerboard Orders export staged for Spec 139 benchmark
- Papi uploaded Sellerboard Orders CSV for 2026-05-01 to 2026-06-16 export window.
- Staged securely under /root/sales-data/imports/cogs/ and copied to /root/sales-data/imports/sellerboard/orders/ for benchmark/reconciliation use.
- Dry-run against COGS importer performed no DB writes and rejected rows as expected because this is an Orders report, not a Products/COGS export; COGS tables remain empty pending Products/BoxEm buy-cost export.

## [2026-06-16T01:52:17Z] status | [hermes] Sellerboard dashboard-by-product staged/dry-run
- Papi uploaded Sellerboard Dashboard-by-product CSV for Spec 139 COGS bridge.
- Raw dry-run recognized ASIN/SKU/Name but rejected as COGS because Sellerboard uses negative `ProductCost Sales` instead of positive cost columns.
- Derived normalized COGS dry-run file created at `/root/sales-data/imports/cogs/derived/20260616T015124Z-sellerboard-dashboard-by-product-derived-cogs.csv` using abs(ProductCost Sales) and summed unit columns; 37 accepted, 0 rejected, DB unmutated.
- Follow-up: fuller seed still needs BoxEm Inventory/Buy-Cost or Sellerboard Products/COGS export with true product buy costs.

## [2026-06-16T02:04:47Z] status | [hermes] BoxEm buy-cost export staged/dry-run
- Papi uploaded BoxEm `2026_06_16-buy-cost-export.csv` for Spec 139 COGS bridge.
- Raw dry-run detected ASIN/SKU/FNSKU but rejected because this export labels cost as `Buycost` while the importer expects `buy cost`/`unit cost`.
- Derived normalized file created at `/root/sales-data/imports/cogs/derived/20260616T020349Z-boxem-buy-cost-derived-cogs.csv`; dry-run accepted 88 rows, rejected 0, warned 0, DB unmutated.
- Follow-up: ask Papi for explicit approval before real-importing the derived BoxEm seed.

## [2026-06-16T02:09:26Z] status | [hermes] BoxEm COGS seed imported
- Papi explicitly approved real import: “Import the BoxEm COGS seed”.
- Created pre-import DB backup `/root/sales-data/db/backups/sales-before-boxem-cogs-20260616T020841Z.db` (`0600`, 1,224,704 bytes).
- Imported `/root/sales-data/imports/cogs/derived/20260616T020349Z-boxem-buy-cost-derived-cogs.csv` as source `boxem`; result `ok`, import_run_id 3, 88 accepted, 0 rejected, 88 observations.
- Verified DB now has `cogs_import_runs=1` and `cogs_observations=88`; handoff updated at `/root/context/139-profit-engine-cogs-bridge-handoff.md`.

## [2026-06-16T02:20:30Z] status | [hermes] COGS coverage report generated/reviewed
- Created Spec 140 and dispatched `140_1-cogs-coverage-report` to OpenClaw `grunt-eng`.
- Output generated under `/root/sales-data/reports/cogs-coverage/` plus read-only script `/root/sales-data/scripts/cogs_coverage_report.py`.
- Re-review accepted with no critical issues; DB counts unchanged.
- Key metrics: 2024 Amazon item rows, 1900 units, $185,424.25 item revenue; 188 rows / 177 units / $9,854.47 revenue covered; estimated covered COGS $7,880.00; pre-fee/tax/refund margin $1,974.47; 1836 rows missing cost.

## [2026-06-16T05:07:51Z] task | [hermes] Spec 141 parser backfill audit complete

- Completed read-only n8n Gmail order-parser backfill audit for 2026-04-09 through 2026-04-16 using daily `in:anywhere -in:spam -in:trash` slices to avoid Gmail 500-message cap.
- Verified no Google Sheet writes: account A source, account B source, and master snapshots remained identical before/after.
- Results: 16/16 parser runs exited 0; 36 dry-run append events collapsed to 25 unique candidates; 9 priced canonical groups technically appendable; 1 cancel/refund row set aside; 4 clean candidates need manual review.
- Recommendation: do not switch fully to Option B yet; add business-inventory review filter and canonicalize lifecycle rows before append.
- Artifacts: /root/reviews/artifacts/141_1-parser-backfill-audit-2026-04-09/audit-report.md and audit-summary.json.

## [2026-06-16T05:20:34Z] task | [hermes] Spec 142 approved inventory append complete

- Papi approved exactly two parser-backfill rows: Walmart Strixhaven Codex Bundle (qty 5, $499.85) and eBay Pokémon 151 Alakazam ex Collection Box (qty 12, $1,140.00).
- Delegated append/master-refresh to OpenClaw grunt-eng via `/root/tasks/142_1-approved-inventory-append.txt`; task completed with `.done`.
- Source sheet results: account A row 15 appended; account B row 39 appended; master refreshed to 52 rows.
- Hermes independently verified the two approved orders appear exactly once in their source sheets and master; zero `Todd Snyder` rows in account A, account B, or master after append.
- Todd Snyder candidates were classified as apparel (polo/linen/shirt/sweater/button-down/Men's XL/Baird McNutt/Riviera) and remain excluded.

## [2026-06-16T05:51:44Z] task | [hermes] Spec 143 parser backfill GPT second review complete
- Dispatched OpenClaw mid/GPT read-only second pass for 2026-04-09 backfill week.
- Outcome: no brand-new high-confidence priced unappended inventory found; recovered price evidence for eBay Unova Mini Tin, eBay First Partner, and Dell Epson EcoTank review rows.
- Sheets/parser/sales DB stayed unchanged during second review; next step is Papi manual approval for any of the three candidates.

## [2026-06-16T06:23:43Z] task | [hermes] Spec 144 approved second-review append complete
- Appended Papi-approved eBay Unova Mini Tin and First Partner Illustration rows to Account B source; refreshed master.
- Verified Account A unchanged at 15 rows, Account B 39→41, master 52→54.
- Verified Dell 1032444096, Klarna #1353190, and Todd Snyder/apparel were not appended.
- Spec/task: /root/specs/144-parser-backfill-approved-second-review-append.md, /root/tasks/144_1-approved-second-review-append.done.

## [2026-06-16T06:33:36Z] handoff | [hermes] Window 2026-04-09 backfill complete — handoff doc refreshed for next window
- All four curated rows appended and verified (Specs 142, 144).
- Sheets: Account A 15, Account B 41, Master 54.
- Sales DB: BoxEm COGS seed 88 obs imported.
- Business-inventory filter rules documented.
- Handoff: /root/context/139-profit-engine-cogs-bridge-handoff.md updated with current state, spec status, pipeline scripts, filter rules, and next-window resume steps.
- Next backfill window: 2026-04-02 → 2026-04-09.

## 2026-06-23 implementation | [hermes] Spec 149 Rare Date Dex edits/calendar/notification dispatched
- Authored /root/specs/149-rare-date-dex-edits-calendar-notify.md and /root/tasks/149-rare-date-dex-edits-calendar-notify.txt.
- User-provided crying Pokemon GIF was not visible in Hermes filesystem; task instructs OC to deploy hook/fallback and record BLOCKED_ON_GIF_ASSET if still missing.

## [2026-06-23T01:12:22Z] status | [hermes] Spec 149 Rare Date Dex verified / GIF asset blocked
- Live site: https://dates.rareforceone.cloud/; public /, /styles.css, /app.js verified HTTP/2 200.
- Copy/UI live: first heading `Will you go on your adventure with me?`; second heading `She actually said yes!`; Route Unlock has Other + custom text input; final screen has Confirm.
- Confirm backend verified with a live temporary Google Calendar event in mramirez021111, Hermes/papipa Telegram notification response, then test event deleted; final mid review SIGNOFF at /root/reviews/149-rare-date-dex-final.review.
- Remaining blocker: user crying Pokemon GIF attachment not accessible; /assets/crying-pokemon.gif 404, fallback displays until real GIF is copied to /srv/rare-date-dex/current/assets/crying-pokemon.gif.

## [2026-06-23T01:27:37Z] status | [hermes] Spec 149 Rare Date Dex copy/GIF correction complete
- User corrected first heading to `Will you go on an adventure with me?`; live page verified new heading once and old `your adventure` copy zero times.
- User-provided Tenor Meowth GIF deployed to `/srv/rare-date-dex/current/assets/crying-pokemon.gif`; public asset verified HTTP 200 image/gif, GIF89a, 640x480; browser sees it on confirmation screen.
- Previous GIF asset blocker resolved; calendar/notification backend unchanged.

## [2026-06-23T01:30:00Z] fast-ingest | karpathy-second-brain-wiki
- Built fast-ingest lane (option B): new skill system/skills/wiki-fast-ingest.md; WIKI_SCHEMA.md gains source_type:bookmark, ingest_mode:fast, and a required ## Action Items section; wiki-operations.md now documents two lanes (full vs fast).
- Inaugural fast capture: raw/clips/karpathy-second-brain-wiki.md -> wiki/sources/karpathy-second-brain-wiki.md.
- New pages: entities/andrej-karpathy, concepts/second-brain-wiki. Linked source<->entity<->concept<->skill.
- Context: this lane is the engine for the parked bookmarks project (TikTok/X/Reddit). No grunt/mid review (fast lane by design).

## [2026-06-23T01:45:00Z] fast-ingest | tiktok AI folder (pilot batch of 4)
- First real bookmarks pilot. Source: TikTok collection "AI" (@tortilla_papi). Links supplied by user; metadata via TikTok oEmbed (caption+creator; no transcript).
- Raw: raw/bookmarks/ai-folder-pilot-2026-06-23.md (immutable).
- New topic/folder index: wiki/topics/ai.md (table of bookmarks + per-item action + categorization-optimization note).
- New entity: entities/claude-code (3 of 4 reference it).
- 4 bookmark source pages: tiktok-one-cloud-claude-iac, tiktok-claude-room-redesign, tiktok-colton-ai-automation-setup, tiktok-dylanworr-build-cool-tech-mindset.
- Limitation surfaced: caption-level only; transcript capture would raise value (parked w/ export automation). TikTok collection contents are not server-scrapable (signed/auth API) — user must supply links or use TikTok data export.

## [2026-06-23T02:05:00Z] feature | transcript capture added to fast-ingest (option A) + pilot re-ingest
- Built local transcription: /root/scripts/tiktok-transcribe.py (yt-dlp audio -> faster-whisper base/int8, venv /opt/stt-venv). No API key, no cost. ~11s per 36s clip on 2-core CPU. Also returns creator+caption+duration.
- wiki-fast-ingest skill: added the transcribe step for video/audio bookmarks; synthesize from transcript not caption; normalize Whisper mishears (Clawed=Claude, cloud code=Claude Code).
- Re-ingested all 4 AI-folder pilots from transcripts. Captions had hidden the real content: #3 Colton = RAG-for-Claude-Code (YouTube/voice-memo ingestion, Telegram voice control); #4 dylanworr = build-your-own second-brain (vector embeddings, hybrid storage). Both directly relevant to THIS project. Re-categorized topics/ai.md accordingly.
- New raw: raw/bookmarks/ai-folder-pilot-2026-06-23-transcripts.md (verbatim STT).
- Surfaced two roadmap decisions for the vault: YouTube-link auto-transcript ingestion, and an optional vector/semantic retrieval layer.

## [2026-06-23T09:12:34Z] status | [hermes] Clear-ready handoff for Rare Date Dex
- Wrote `/root/context/hermes-clear-handoff-rare-date-dex-2026-06-23.md` with live URL, verification evidence, key files, and resume notes.
- Confirmed `/root/obsidian-vault` is the only git repo among inspected project/shared paths; site root and specs/tasks/reviews/context are filesystem records, not git repos.
- Rare Date Dex remains complete with no active blocker: heading corrected to `Will you go on an adventure with me?`, GIF live, calendar/notification flow previously verified.

## [2026-06-23T02:20:00Z] docs | documented fast-ingest + bookmarks build
- Updated system/projects/bookmark-hell-pipeline.md (Hermes's parked plan): status -> "ingestion+extraction core BUILT & piloted"; added 2026-06-23 build section (fast-ingest lane, tiktok-transcribe.py, Obsidian link-graph storage, AI-folder pilot, TikTok scrape wall, what's still parked). Preserved original plan.
- Refreshed wiki index.md catalog (was stale since 05-15): added andrej-karpathy, claude-code, second-brain-wiki, ai topic, 5 new sources.
- Cross-checked: fast-ingest lane also documented in system/skills/wiki-fast-ingest.md + system/workflows/wiki-operations.md + WIKI_SCHEMA.md.
## [2026-06-24] deprecation | [hermes] Deprecated legacy Orders Master sheet (spec 150)
- Renamed Google Drive file `1SlhST4ATYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k` from `Orders — Master` to `DEPRECATED — Orders Master (legacy; use Purchase Log - Master)`.
- Set description warning that active parser master is `Purchase Log - Master` (`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`).
- Updated system/projects/orders-dashboard.md: mark legacy source as DEPRECATED, point to active master.
- Updated wiki/topics/n8n-order-parser.md: replaced stale "still reads old Gemini source until Spec 51" line with current deprecation status.
- Active `Purchase Log - Master` file untouched. Both files remain in Drive, not trashed.

## [2026-06-24] decommission | [hermes] Deleted legacy Orders Master and decommissioned Orders Dashboard (spec 151)

- Backup dir: `/root/backups/orders-dashboard-decommission-20260624T194544Z/`
- Legacy Drive file `1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k` (`DEPRECATED — Orders Master (legacy; use Purchase Log - Master)`) trashed in Google Drive; `.xlsx` export saved to backup dir.
- Active parser master `Purchase Log - Master` (`1VA5dXBwTy7p7yoi2sWbWL56x71V9rRLbxRy1uftwrNM`) verified unchanged, `trashed=false`.
- Dashboard units stopped/disabled/masked: `orders-dashboard.service`, `orders-pull.timer`, `orders-pull.service`, `orders-dashboard-7day-check.timer`, `orders-dashboard-7day-check.service`.
- Port 5002: nothing on `127.0.0.1:5002` (Tailscale DERP uses port 5002 on its own IPs — unrelated).
- UFW: no dedicated 5002/tcp rule found; nothing removed.
- Caddy: no isolated route for orders-dashboard or port 5002 found; nothing changed.
- Vault docs updated: `system/projects/orders-dashboard.md`, `wiki/topics/orders-dashboard.md`, `wiki/topics/n8n-order-parser.md`, `system/resources/registry.md`, `core-index.md`, `system/projects/index.md`, `system/governance/cc-memory.md`, `system/skills/dashboard-healthcheck.md`, `system/skills/index.md`.
- Marker: `/root/orders-dashboard/DECOMMISSIONED.md` written.

## [2026-06-24T20:20:00Z] spec | 152 TikTok bookmarks bulk ingest (parked)
- Analyzed Papi's full TikTok export (read-only): 2,011 favorites ({Date,Link} only, no captions), 6,000 likes, 67 folder NAMES but NO folder->video mapping (export "Collection" is empty). TikTok collection pages not scrapable.
- Wrote /root/specs/152-tiktok-bookmarks-bulk-ingest.md: phased plan (scale test 50 -> lightweight storage -> throttled resumable full run), classify-by-content into the 67 folder names. Parked on 5 open decisions (scope, scale test, granularity, order, pacing).
- Export stashed /root/bookmarks-data/tiktok-export-2026-06-24.json (out of git, personal bulk data). Nothing processed — awaiting Papi.

## [2026-06-24T20:35:00Z] closeout | Orders Master deletion + Rare Date Dex (at Papi's direction)
- Specs 150 + 151 (delete legacy Orders Master / decommission Orders Dashboard) -> status complete. Verified: legacy Orders Master Drive file trashed=true, active "Purchase Log - Master" untouched; orders-dashboard.service inactive+masked. (Built by Hermes; closed by Metis per Papi.)
- Specs 148 + 149 (Rare Date Dex) -> complete. Verified live: dates.rareforceone.cloud HTTP 200; previously-blocking crying-pokemon.gif now HTTP 200 (554KB, fallback gone). pokemon-date-planner project status -> live-complete.
- Updated /root/specs frontmatter + closeout notes, projects index, pokemon-date-planner.md.

## [2026-06-25T04:11:26Z] ops | [hermes] VPS memory cleanup: stale Hermes LSP helpers cleared
- Investigated steady ~40% VPS memory use. System was healthy: memory PSI 0.00, no swap usage because no swap configured, and available RAM remained healthy.
- Identified stale Hermes LSP/helper child processes under the main Hermes gateway: `pyright-langserver`, `typescript-language-server`, `tsserver.js`, `typingsInstaller.js`, and `bash-language-server`.
- Safely terminated only the gateway-owned LSP/helper children; did not stop/restart main Hermes, Milo, or Papipa gateways.
- Result: LSP helper PSS dropped from ~583.8 MB to 0; overall used RAM dropped from ~3.4 GiB to ~2.8 GiB; available RAM rose to ~4.9-5.0 GiB.
- Verified `hermes-gateway.service`, `hermes-gateway-milo.service`, and `hermes-gateway-papipa.service` remained active after cleanup.

## [2026-06-25T18:53:55Z] ops | [hermes] Task hygiene + parser repo cleanup before Profit Engine pivot
- Cleaned `/root/n8n/local-files/order-parser` working tree: committed deployed Walmart partial-order fix + regression test as `1dd8d51` (`Fix Walmart partial order IDs`). Verification: all `test_*.js` scripts passed and `fixtures-run.sh` reported 6/6 passed.
- Archived stale orphan task/review prompts and completed `.progress` markers to `/root/tasks/archive/hygiene-20260625T185256Z/` with `MANIFEST.txt`; no `.done` or active `.blocked` markers removed.
- Post-cleanup task scan has no orphan prompt/progress noise; remaining live blocker is `/root/tasks/136-amazon-spapi-sales-connector.blocked`.

## [2026-06-25T22:31:12Z] data | [hermes] Synced Amazon 2026 orders and recalculated COGS gap
- Backed up `/root/sales-data/db/sales.db` to `/root/sales-data/backups/sales.db.bak-20260625T211119Z-pre-amazon-2026-sync` before mutation.
- Ran Amazon SP-API sync from `2026-01-01T00:00:00Z`; normal sync hit Orders API 429 throttling, then slow resumable per-order sync completed successfully at `2026-06-25T22:24:23Z`.
- Verified DB integrity: SQLite quick check `ok`, foreign key check rows `0`.
- Local Amazon canonical state now has 1,818 2026 orders / 1,852 item rows through purchase date `2026-06-25T20:22:40Z`; no 2026 Amazon orders missing item rows.
- 2026 practical COGS gap after excluding canceled Amazon rows: Amazon needs 6 distinct item keys / 29 rows / 31 units; eBay needs 1 distinct item key / 3 rows / 3 units; combined gap is 7 item keys / 32 rows / 34 units / `$5,459.68` revenue.
- Wrote private aggregate reports under `/root/sales-data/reports/cogs-coverage/2026-cogs-gap-after-amazon-sync-20260625.{md,json}`.

## [2026-06-25T20:33:30Z] data | [hermes] Imported Sellerboard COGS seed into Profit Engine
- Staged Sellerboard CSV under `/root/sales-data/imports/cogs/sellerboard/` and derived normalized import file under `/root/sales-data/imports/cogs/derived/`; original export preserved unchanged.
- Created pre-import SQLite backup: `/root/sales-data/backups/sales.db.bak-20260625T203120Z-pre-sellerboard-cogs-import`.
- Ran approved real import: source `sellerboard`, import_run_id=4, rows=981, accepted=238, rejected=743 blank/invalid cost rows, observations=238, dry_run=false.
- Verified DB integrity (`quick_check=ok`, foreign_key_check=0) and active COGS observations: BoxEm=88, Sellerboard=238.
- Generated coverage artifacts: `/root/sales-data/reports/cogs-coverage/sellerboard-plus-boxem-coverage-20260625.md` and `.json`; coverage improved to 1,922/2,024 Amazon item rows (95.0%) and $180,228.36/$185,424.25 item revenue (97.2%).


## [2026-06-29T01:03:43Z] data | [hermes] eBay OAuth refreshed and live Profit Engine sync validated
- Replaced the invalid eBay token path with a current seller OAuth access token captured via local hidden-input auth-code exchange; status now healthy with expiry, scopes=2, client metadata present, RuName present.
- Live eBay dry-run since 2026-01-01T00:00:00Z succeeded: orders_seen=8, dry-run new count=8, finance_events_seen=0.
- Backed up `/root/sales-data/db/sales.db` to `/root/sales-data/backups/sales.db.bak-20260629T010156Z-pre-ebay-reauth-sync2` before mutation.
- Real sync succeeded: run 1 orders_seen=8, new=5, updated=1, unchanged=2; run 2 idempotent with new=0, updated=0, unchanged=8.
- Aggregate DB state: `ebay_orders`=8, `ebay_order_items`=8, `ebay_fin_events`=0; SQLite integrity check `ok`; foreign key check rows `0`; regression suite `159 passed in 5.72s`.
- Marker closed: `/root/tasks/153_2-ebay-finance-oauth-readiness.done`; stale `.blocked` and `.progress` markers removed.

## [2026-06-29T03:31:37Z] data | [hermes] Profit Engine v1 finalized, spreadsheet uploaded, evergreen project documented
- Spec 153 is complete: Amazon finance DB repair accepted; final 2026 YTD net-profit v1 report accepted after independent review. Headline: net profit `$15,083.64`, net margin `14.0%`, revenue `$107,882.49`.
- Spec 154 Phase 1 is complete: aggregate-only Profit Engine spreadsheet workbook generated from accepted JSON, safety-scanned, independently reviewed, and uploaded to `mramirez021111` Drive as `Profit Engine Spreadsheet v1 - 2026 YTD.xlsx` (`1RtPXpAPUGO5tqXvq-uckGOEG-YiJb3QR`).
- Created canonical evergreen project page `system/projects/profit-engine.md`, indexed it in `system/projects/index.md`, and updated `system/projects/parked-backlog.md` to mark Profit Engine as evergreen-active rather than parked.
- Wrote new-session handoff `/root/context/profit-engine-evergreen-session-handoff-2026-06-29.md`; next focused upgrade is Spec 154 Phase 2: eBay finance events + missing eBay COGS, then rerun report and spreadsheet.

## [2026-06-29T22:57:29Z] ops | [hermes] Rotated OpenClaw grunt sessions
- Forced rotation of default grunt lanes after safety checks passed.
- Targets: `grunt`, `grunt-eng`; running tasks: 0; fresh progress blockers: none.
- Archives: `/root/.openclaw/agents/grunt/sessions/archive/auto-20260629T225701Z`, `/root/.openclaw/agents/grunt-eng/sessions/archive/auto-20260629T225701Z`.
- Post-verify: both lanes reset to empty `sessions.json`, 42 bytes non-archive store, `would_rotate=false`.

## [2026-06-30] maintenance | [hermes] Google Drive organization safe batch executed
- Executed approved safe batch for spec 156 on `mramirez021111@gmail.com` via OpenClaw `grunt-eng`.
- Result: 136/136 reversible Drive metadata mutations succeeded; no deletes, sharing changes, or Docs/Sheets content edits.
- Live verification: root now 26 items = 10 folders + 16 loose files; all 16 loose files are the intentional excluded review set.
- Artifacts: `/root/workspace/google-drive-org-20260629/phase1-safe-batch-mutation-log.jsonl`, `/root/reviews/156-google-drive-workspace-organization-execution-report.md`, `/root/tasks/156-google-drive-workspace-organization.done`.


## [2026-06-30T07:29:04Z] data | [hermes] Profit Engine eBay gap closure started; blocked on Papi inputs
- Spec 154 Phase 2 started at Papi's direction. Dispatched `/root/tasks/154_2-ebay-gap-closure-refresh-finance-cogs.txt` to OpenClaw `grunt-eng`.
- Implemented and verified eBay OAuth refresh support in `/root/sales-data` with `174 passed`; live sync now blocks cleanly because `/root/secrets/sales/ebay.json` lacks `cert_id` / client secret.
- Fixed `/root/bin/store-ebay-oauth-token` so secure capture now includes hidden `Cert ID / Client Secret` prompt and presence-only status output.
- Added `/root/bin/add-ebay-cert-id` as the preferred low-friction helper: hidden Cert ID prompt, atomic merge into existing eBay secrets JSON, no token recapture required.
- COGS diagnostic produced `/root/sales-data/reports/cogs-coverage/ebay-unmatched-gaps-20260630.csv`; 4 unmatched eBay items need manual buy-cost values before final net-profit/spreadsheet regeneration.
- Current marker: `/root/tasks/154_2-ebay-gap-closure-refresh-finance-cogs.blocked`; spec status `phase_2_blocked_user_input`.


## [2026-06-30T07:45:16Z] data | [hermes] Profit Engine eBay gap blocker refined
- Follow-up tasks 154_2c-154_2e enriched the eBay COGS input template, fixed item-summary double-counting, and updated cert_id blocker copy.
- Correct eBay unmatched COGS revenue is `$1,494.99` on line-subtotal semantics; the earlier `$2,194.99` enriched-template figure was rejected after verification because eBay `lineItemCost.value` is already the line subtotal.
- Regression suite now passes `176 passed`; `sync-ebay --dry-run` still blocks cleanly on missing `cert_id` and points Papi to `/root/bin/add-ebay-cert-id`.
- Remaining user inputs: eBay Cert ID via secure helper + four `unit_cost_you_paid` values in `/root/sales-data/reports/cogs-coverage/ebay-unmatched-gaps-enriched-20260630.csv`.

## [2026-06-30T08:37:59Z] work | [hermes] Profit Engine eBay COGS/OAuth gap closed
- Spec 154 Phase 2 completed for OAuth + manual eBay COGS: live sync idempotent, Papi's four costs imported/allocated, eBay COGS 7/7 matched and 0 unmatched.
- Final report: /root/sales-data/reports/profit/net-profit-v1-20260630T081341Z.md / .json; spreadsheet: /root/sales-data/reports/profit/spreadsheet/profit-engine-spreadsheet-v1-20260630T081500Z.xlsx.
- Verified: tests 186 passed, DB quick_check ok, foreign_key_check 0 rows, OC review ACCEPT at /root/reviews/154_4-ebay-gap-closure.review.md.
- Remaining caveat: ebay_fin_events remains 0, so eBay fees/refunds are unavailable and should be handled as a separate Finances API ingestion phase.

## [2026-06-30T08:50:33Z] info | [hermes] Profit Engine eBay gap handoff documented
- Created shared handoff: `/root/context/profit-engine-ebay-gap-handoff-2026-06-30.md`.
- Updated project doc and vault handoff for eBay OAuth + COGS closure.
- Created next-phase prompt: `/root/tasks/154_6-ebay-finance-events-ingestion.txt` for `ebay_fin_events = 0` caveat.
- No secrets included.

## [2026-07-01T04:35:23Z] task-hygiene | [hermes] Archived stale Amazon SP-API credential blocker
- Archived resolved stale blocker `/root/tasks/136-amazon-spapi-sales-connector.blocked` to `/root/tasks/archive/hygiene-20260701T043517Z-resolved-amazon-blocker/` after Task 158 audit verified Amazon SP-API credentials are present and config-valid.
- Evidence: `/root/reviews/158-profit-engine-caveats-and-amazon-blocker-audit.md`, `/root/tasks/158_1-profit-engine-caveats-amazon-blocker-audit.done`.


## [2026-07-01T04:59:29Z] ops | [hermes] Spec 158 Profit Engine caveats/Amazon/TRANSFER accepted
- Completed `/root/specs/158-profit-engine-caveats-and-amazon-blocker-audit.md`: caveats audit, Amazon SP-API blocker decision, and eBay TRANSFER semantics.
- Amazon SP-API credentials are present/config-valid; stale 2026-06-11 credential blocker archived with manifest under `/root/tasks/archive/hygiene-20260701T043517Z-resolved-amazon-blocker/`.
- eBay TRANSFER rows observed as CREDIT/TRANSFER_FROM/PAYOUT and accepted into P&L as adjustments after `re-review`/Qwen ACCEPT.
- Verification: `210 passed`, SQLite `quick_check=ok`, `foreign_key_check=0 rows`; latest report `/root/sales-data/reports/profit/net-profit-v1-20260701T044751Z.{md,json}`.
- Final headline: combined net profit `$13,888.83` / `12.9%`; eBay net profit `$1,290.38` / `40.8%`; Amazon net profit `$12,598.45` / `12.0%`.

## [2026-07-01 05:46 UTC] status | [hermes] Profit Engine Spec 159 accepted
- Completed guarded Amazon SP-API sync validation and ServiceFee caveat fix.
- Finance sync ingested 73 new Amazon finance events after dry-run + DB backup; combined net profit now $13,791.83, Amazon $12,501.45, eBay unchanged $1,290.38.
- Undated Amazon ServiceFee caveat is now 704 rows / -$3,149.26 and report caveat text is dynamic.
- Final Qwen/re-review accepted; tests 211 passed; DB quick_check ok / foreign_key_check 0.
- Known caveat: Amazon Orders API hit transient 429 after 1,300/1,900 orders checked during live sync; all checked unchanged and pre-sync dry-run showed 0 order changes.

## [2026-07-01 06:58 UTC] project | [hermes] Profit Engine Spec 160 accepted

- Closed Spec 160: Amazon Orders throttle rerun, undated ServiceFee allocation decision, and forward-only FIFO hardening.
- Results: 1,901 Amazon orders checked with 0 new/updated and no 429; 704 undated ServiceFee rows / -$3,149.26 remain included but unallocated because no deterministic allocation date exists.
- FIFO: schema/engine/status live from 2026-07-01T00:00:00Z; 4 lots / 8 units seeded; 0 allocations; historical P&L unchanged at combined net profit $13,791.83.
- Verification: final Qwen review ACCEPT; 229 tests passed; DB quick_check ok and foreign_key_check 0; report outputs aggregate-only/secret-safe.

## [2026-07-01 17:45 UTC] project | [hermes] Spec 161 approvals received; live parser phase dispatched

- Papi approved live parser backfill writes, the TheCanvasDon parser fix, and the next parser/COGS linkage phase.
- Resumed Spec 161 under Hermes orchestration and wrote task specs/prompts for `161_3-live-parser-backfill-canvasdon-fix` and `161_4-parser-sale-link-export-table`.
- Archived the resolved parent `.blocked` marker and created a parent `.progress` marker; dispatched `161_3` to OpenClaw `grunt-eng` first to avoid source-sheet/parser collisions.
- `161_4` is queued but dependency-gated until 161_3 has a done/progress marker and Hermes reviews it.
