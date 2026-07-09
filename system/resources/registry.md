---
type: system-resource
title: Resource Registry
slug: registry
last_synced: 2026-06-10
maintainer: cc-oc-orchestrator
tags: [ops, resources, registry, shared-brain]
---

# Resource Registry

The single map of every resource the VPS agents (CC/Claude, Codex, OpenClaw, and
Hermes) can touch. Canonical knowledge lives in the vault under
`system/`; each agent keeps only a thin pointer in its native config. If a native
config and a `system/` page disagree, **the `system/` page wins** — re-sync the
native pointer.

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

## Shared orchestration workspace (CC + Codex; not in vault)
| Resource | Location | Owner | Access |
|---|---|---|---|
| Specs | `/root/specs/` | CC + Codex (`owner:` frontmatter) | read/write |
| Task prompts + markers | `/root/tasks/` | CC + Codex | read/write |
| Reviews | `/root/reviews/` | CC + Codex | read/write |

## Per-agent native config (private; shared content mirrored into `system/`)
| Resource | Location | Owner | Shared? | Access |
|---|---|---|---|---|
| CC orchestrator config | `/root/CLAUDE.md` | CC | conventions mirrored to `system/` | CC reads each session |
| Codex config | `/root/AGENTS.md` | Codex | conventions mirrored to `system/` | Codex reads each session |
| CC skills | `/root/.claude/skills/` | CC | mirrored to `system/skills/` | CC autoload |
| CC auto-memory | `/root/.claude/projects/-root/memory/` | CC | ops subset mirrored to `system/` | CC private |
| Codex private state | `/root/.codex/` | Codex | NO — do not read | Codex only |
| Lessons-learned source | `/root/context/cc-oc-lessons-learned.md` | CC | mirrored to `system/workflows/lessons-learned.md` | shared via mirror |

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
| Telegram PA | Hermes profile `papipa` / Mnemosyne | OpenClaw `pa` agent and Telegram `pa` route were removed 2026-07-09; personal-assistant workflows live under Hermes/Mnemosyne instead. |
| Gmail / Calendar / Drive | MCP connectors (CC) + n8n OAuth creds | Drive enough for now; Calendar/Docs deprioritized |
| Notion | MCP connector + `notion/` mirror | mirror is sink, not source |
| Web | search/fetch tools (CC) | — |

## Live systems on the VPS
| System | Where | Notes |
|---|---|---|
| n8n | Docker `n8n-n8n-1`, localhost:5678; public `https://n8n.rareforceone.cloud` (Caddy proxy, spec 52) | order-parser automation — see `system/projects/n8n-order-parser`. OAuth redirect must be `https://n8n.rareforceone.cloud/rest/oauth2-credential/callback`; consent screen is Published (no 7-day token expiry) |
| Orders Dashboard | DECOMMISSIONED 2026-06-24 (spec 151) | Flask/SQLite, v1.0 — was port 5002; stopped/disabled/masked. See `system/projects/orders-dashboard`. Legacy sheet trashed. |
| Mission Control | `127.0.0.1:5003` | Flask read-only cockpit over agents/tasks/blockers/schedules/search; token-protected (token at `/root/secrets/mission-control/url-token.txt`, mode 0600); no write actions, no public route yet — see `system/projects/mission-control` |
| OpenClaw gateway | systemd user service `openclaw-gateway.service` | `openclaw gateway status` is authoritative; currently runs `/usr/bin/node /usr/lib/node_modules/openclaw/dist/index.js gateway --port 18789` |
| Hermes / Janus gateway | Hermes default profile under `/root/.hermes/` | Peer orchestrator, systemd-supervised; shared project state remains in `/root/specs`, `/root/tasks`, and `/root/reviews` |
| Milo fitness bot | `/root/.hermes/profiles/milo/`; `hermes-gateway-milo.service` | Workout + nutrition Telegram profile; deterministic kernels and Google Sheets backend — see `system/configs/milo-fitness` |
| Mnemosyne PA bot | `/root/.hermes/profiles/papipa/`; `hermes-gateway-papipa.service` | Personal-assistant profile and deterministic capture/reminder layer — see `system/configs/mnemosyne-pa` |

## Ops helper scripts & scheduled jobs (VPS, not in vault)
| Resource | Location / handle | Purpose |
|---|---|---|
| `sheets-read.sh` | `/root/scripts/` | read-only Google Sheets read, reuses n8n OAuth (spec 60) |
| `gmail-orders-list.sh` | `/root/scripts/` | read-only inbox order-candidate lister (spec 61) |
| `filter-parser-excluded.js` | `/root/scripts/` | DRY recall filter that applies the parser's exported exclusion checks before audit miss classification (spec 102) |
| `verify-done-files.sh` | `/root/scripts/` | verify a `.done` marker's FILES_CHANGED vs git/fs ground truth (spec 59) |
| n8n parser daily audit | OC cron `n8n-parser-daily-audit` (id `b769b0b5…`) | `lead`, 09:20 PT / 16:20 UTC daily; active, not self-expired; runbook uses `--exclude-parser-rejects`; runbook `system/runbooks/n8n-parser-daily-audit.md`; log `system/logs/n8n-parser-daily-check.md` |
| second parser audit | systemd `parser-cc-review.timer` | unattended CC review at 09:35 PT; script `/root/scripts/parser-cc-review.sh`; isolated config/log dir `/opt/cc-parser-review` |

## Private — listed for completeness, not shared
- CC behavior-only memory (how CC should act): stays in CC auto-memory.
- `/root/.codex/`: Codex private state — never read.
- Per-agent API credentials / OAuth tokens: per-agent, not shared as data.
