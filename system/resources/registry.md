---
type: system-resource
title: Resource Registry
slug: registry
last_synced: 2026-05-21
maintainer: cc-oc-orchestrator
tags: [ops, resources, registry, shared-brain]
---

# Resource Registry

The single map of every resource the VPS agents (CC/Claude, Codex, OpenClaw, and
the planned Hermes agent) can touch. Canonical knowledge lives in the vault under
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
| Telegram | `openclaw message send` (chat ID 1207164084) | use `message send`, never `agent --deliver` |
| Gmail / Calendar / Drive | MCP connectors (CC) + n8n OAuth creds | Drive enough for now; Calendar/Docs deprioritized |
| Notion | MCP connector + `notion/` mirror | mirror is sink, not source |
| Web | search/fetch tools (CC) | — |

## Live systems on the VPS
| System | Where | Notes |
|---|---|---|
| n8n | Docker `n8n-n8n-1`, localhost:5678 | order-parser automation — see `system/projects/n8n-order-parser` |
| Orders Dashboard | port 5002 | Flask/SQLite, v1.0 — see `system/projects/orders-dashboard` |
| OpenClaw gateway | plain process (not systemd) | check with `pgrep -af`, not `systemctl` |

## Planned
| Agent | Status | Onboarding |
|---|---|---|
| Hermes | not yet installed | on install, point it at `system/` as canonical; add a native pointer like CLAUDE.md/AGENTS.md |

## Private — listed for completeness, not shared
- CC behavior-only memory (how CC should act): stays in CC auto-memory.
- `/root/.codex/`: Codex private state — never read.
- Per-agent API credentials / OAuth tokens: per-agent, not shared as data.
