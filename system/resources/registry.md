---
type: system-resource
title: Resource Registry
slug: registry
last_verified: 2026-08-10
maintainer: cc-oc-orchestrator
tags: [ops, resources, registry, shared-brain]
---

# Resource Registry

The single map of every resource the VPS agents (Hermes/Janus, CC/Metis, Codex, and the
OpenClaw fleet) can touch.

**Precedence, one line:** live runtime beats vault `system/`; vault `system/` beats any
`/root` file; skills and per-harness files point rather than restate — and if a doc names
a model or tier, run the CLI before trusting it.

Canonical knowledge lives under `system/`; each agent keeps only a thin pointer in its
native config. Full contract: [[system/workflows/peer-orchestrator-protocol]].

## Shared & synced (vault — flows to GitHub `tortillapapi/Vault-0` → Mac/phone)
| Resource | Location | Owner | Access |
|---|---|---|---|
| Vault root | `/root/obsidian-vault/` | all agents | filesystem |
| Wiki schema | `WIKI_SCHEMA.md` | all | read before wiki work |
| Core/full index | `core-index.md`, `index.md` | all | read before query/ingest |
| Activity log | `log.md` | all (tag `[cc]`/`[codex]`) | append-only |
| Raw sources | `raw/` | OC-written, immutable | read-only |
| Wiki pages | `wiki/` | OC-owned | never hand-edit; route via OC |
| System KB | `system/` | shared canonical | read freely; write via OC |
| Notion mirror | `notion/` | one-way sink | NOT reference material — see operating-rules |

## Shared orchestration workspace (all peers; not in vault)
| Resource | Location | Owner | Access |
|---|---|---|---|
| Specs | `/root/specs/` | all peers (`owner:` frontmatter — mostly `hermes`) | read/write; **audit trail, never deleted** |
| Task prompts + markers | `/root/tasks/` | all peers | read/write; archived per protocol |
| Reviews | `/root/reviews/` | all peers + OC executor QA | read/write; **audit trail, never deleted** |

## Per-agent native config (private; shared content mirrored into `system/`)
| Resource | Location | Owner | Shared? | Access |
|---|---|---|---|---|
| CC config | `/root/CLAUDE.md` | CC | **pointers only** — rules live in `system/` | CC reads each session |
| Codex config | `/root/AGENTS.md` | Codex | **pointers only** | Codex reads each session |
| Hermes config | `/root/.hermes.md` | Hermes | loads ONLY this file — shared rules restated inline with canonical pointers | Hermes reads each session |
| CC skills | `/root/.claude/skills/` | CC | doc mirror in `system/skills/`; Codex symlinks the live files | load on demand |
| CC auto-memory | `/root/.claude/projects/-root/memory/` | CC | thin cache — **the vault wins on any disagreement** | CC private; `-root-obsidian-vault` symlinked here 2026-08-10 |
| Codex private state | `/root/.codex/` | Codex | NO — do not read | Codex only |
| Lessons-learned | `system/workflows/lessons-learned.md` | shared | **canonical since 2026-08-10**; `/root/context/cc-oc-lessons-learned.md` is now a pointer | read freely |

## OpenClaw runtime (not in vault)
| Resource | Location | Notes |
|---|---|---|
| OC workspace | `/root/.openclaw/workspace/` | symlink `vault → /root/obsidian-vault` |
| OC agent sessions | `/root/.openclaw/agents/<id>/` | session/lock state; clear stale `.lock` on timeout |
| OC agent roster | `openclaw agents list --json` | live source of truth — see `system/configs/openclaw-agents` |

## Live external services (per-agent connections — credentials, not files)
| Service | Reached via | Notes |
|---|---|---|
| Telegram default | `openclaw message send` (chat ID 1207164084) | Alfred/default bot; use `message send`, never `agent --deliver` |
| Telegram PA | Janus (Hermes default) in a dedicated PA chat | OpenClaw `pa` agent and Telegram `pa` route removed 2026-07-09; the Mnemosyne bot was retired 2026-08-10 and PA duties folded into Janus. |
| Gmail / Calendar / Drive | MCP connectors (CC) + n8n OAuth creds | Drive enough for now; Calendar/Docs deprioritized |
| Notion | MCP connector + `notion/` mirror | mirror is sink, not source |
| Web | search/fetch tools (CC) | — |

## Live systems on the VPS
| System | Where | Notes |
|---|---|---|
| n8n | Docker `n8n-n8n-1`, localhost:5678; public `https://n8n.rareforceone.cloud` (Caddy proxy, spec 52) | order-parser automation — see `system/projects/n8n-order-parser`. OAuth redirect must be `https://n8n.rareforceone.cloud/rest/oauth2-credential/callback`; consent screen is Published (no 7-day token expiry) |
| Orders Dashboard | DECOMMISSIONED 2026-06-24 (spec 151) | Flask/SQLite, v1.0 — was port 5002; stopped/disabled/masked. See `system/projects/orders-dashboard`. Legacy sheet trashed. |
| Mission Control | `127.0.0.1:5003` | Flask read-only cockpit over agents/tasks/blockers/schedules/search; token-protected (token at `/root/secrets/mission-control/url-token.txt`, mode 0600); no write actions, no public route yet — see `system/projects/mission-control` |
| Metis gateway | **system** unit `metis-gateway.service` (enabled, running) | CC over Telegram (`@RareForce_Metis_Bot`); sole consumer of that bot token; PreToolUse approval gate — see `system/configs/metis-gateway` |
| OpenClaw gateway | systemd user service `openclaw-gateway.service` | `openclaw gateway status` is authoritative; currently runs `/usr/bin/node /usr/lib/node_modules/openclaw/dist/index.js gateway --port 18789` |
| Hermes / Janus gateway | Hermes default profile under `/root/.hermes/`; **user** unit `hermes-gateway.service` | **Primary orchestrator**, and since 2026-08-10 also the PA. Shared project state remains in `/root/specs`, `/root/tasks`, `/root/reviews` |
| Milo fitness bot | `/root/.hermes/profiles/milo/`; **user** unit `hermes-gateway-milo.service` (enabled) | Workout + nutrition Telegram profile; deterministic kernels and Google Sheets backend — see `system/configs/milo-fitness` |
| PA subsystem (ex-Mnemosyne) | `/root/.hermes/profiles/papipa/`; **user** unit `hermes-gateway-papipa.service` — **disabled 2026-08-10** | Bot retired; PA folded into Janus with its own Telegram chat. The papipa capture kernel, state files, and two cron jobs remain **live** under Janus's name — see `system/configs/mnemosyne-pa` |
| Inventory Command Center | `/root/command-center/` (bridge.db at `db/bridge.db`, 0600, root-only); local git `master` + private remote `git@github.com:tortillapapi/command-center.git` (Spec 217; push pending repo creation) | Inventory + reconciliation layer over `bridge.db`; consumes read-only snapshots from `sales.db`/`finance.db` via `extract_snapshots.py`. Code-only mirror; `db/` and `reports/` excluded by .gitignore — DB never leaves the VPS. See `system/projects/inventory-command-center` |

## Ops helper scripts & scheduled jobs (VPS, not in vault)
| Resource | Location / handle | Purpose |
|---|---|---|
| `sheets-read.sh` | `/root/scripts/` | read-only Google Sheets read, reuses n8n OAuth (spec 60) |
| `gmail-orders-list.sh` | `/root/scripts/` | read-only inbox order-candidate lister (spec 61) |
| `filter-parser-excluded.js` | `/root/scripts/` | DRY recall filter that applies the parser's exported exclusion checks before audit miss classification (spec 102) |
| `verify-done-files.sh` | `/root/scripts/` | verify a `.done` marker's FILES_CHANGED vs git/fs ground truth (spec 59) |
| n8n parser daily audit | OC cron `parser-daily-audit` (id `b769b0b5-225b-4bbf-9ccf-4a3472578e1d`; formerly `n8n-parser-daily-audit`) | **RETIRED/DISABLED** (`enabled: false`) as of 2026-07-30 — kept for reference only; superseded by `hermes-parser-audit.timer` (Spec 202). Was: `mid` (openai/gpt-5.6-luna), 09:20 PT / 16:20 UTC daily, thinking `xhigh` (Spec 191); runbook uses `--exclude-parser-rejects`; runbook `system/runbooks/n8n-parser-daily-audit.md`; log `system/logs/n8n-parser-daily-check.md` |
| second parser audit | systemd `parser-cc-review.timer` + `parser-codex-review.timer` | **MASKED** as of 2026-08-01 (Spec 214) — replaced by `parser-healthcheck.timer`; both reversible via `systemctl unmask`. Formerly: unattended CC review at 09:35 PT (script `/root/scripts/parser-cc-review.sh`, isolated config/log dir `/opt/cc-parser-review`) |
| parser healthcheck | systemd `parser-healthcheck.timer` | deterministic, no LLM on happy path (Spec 214); 09:35 PT / 16:35 UTC daily; script `/root/scripts/parser-healthcheck.sh`; **enabled** |
| profit freshness check | systemd `profit-freshness-check.timer` | read-only Profit Engine staleness alarm (Spec 215); daily; alerts >72h stale; script `/root/scripts/profit-freshness-check.sh`; **enabled** |
| profit refresh | systemd `profit-refresh.timer` | Profit Engine marketplace data refresh (Spec 215); daily; script `/root/sales-data/scripts/scheduled_refresh.py --apply`; **ENABLED and running nightly** — Papi approved 2026-08-03 (Spec 215 closeout); each run takes a pre-refresh backup to `/root/sales-data/db/backups/` |
| nightly OpenClaw rotation | Hermes cron `572c4dc18aed` — handle claimed by spec/historical log; **not found in live `openclaw cron list` at dispatch 2026-08-11 (zero jobs); runtime reconciliation pending, do not treat as verified** | Full-roster session rotation (Spec 227 B4): script `/root/.hermes/scripts/openclaw-nightly-rotation.py`; invoked hourly, performs work only 04:00–04:09 America/Los_Angeles (11:00–11:09 UTC on 2026-08-11); scope `mid`, `lead`, `grunt-eng`, `grunt`, `re-review`, `email-parser`; drives `/root/bin/openclaw-grunt-session-maintenance.py` with explicit `--allow-agent` (tool defaults to `grunt`/`grunt-eng`); guards: active-task check, fresh `.progress` collision check, live-roster drift fail-closed, `safe_to_rotate` preflight, post-check. **B4: unproven — first run pending** (state file `/root/.hermes/state/openclaw-nightly-rotation.json` absent as of 2026-08-11T06:21Z) |
| grunt session watchdog | Hermes cron `eac51421f32b` — handle claimed by spec/historical log; **not found in live `openclaw cron list` at dispatch 2026-08-11 (zero jobs); runtime reconciliation pending, do not treat as verified** | Alert-only, **never kills** (Spec 227): script `/root/.hermes/scripts/openclaw-grunt-session-watchdog.py`; every 6h; scope `grunt`, `grunt-eng`; thresholds 25 sessions, 25 MB store, 30h age (30h approved 2026-08-11); runs the shared maintenance tool in dry-run JSON and prints only when thresholds are exceeded or the check fails; failure detector for the nightly rotation — alert names rotation failure and references cron `572c4dc18aed` |

## Private — listed for completeness, not shared
- CC behavior-only memory (how CC should act): stays in CC auto-memory.
- `/root/.codex/`: Codex private state — never read.
- Per-agent API credentials / OAuth tokens: per-agent, not shared as data.
