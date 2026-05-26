---
type: governance-mirror
source_path: /root/CLAUDE.md
last_synced: 2026-05-26
maintainer: cc-oc-orchestrator
tags: [governance, mirror, audit]
---
> ⚠️ READ-ONLY MIRROR of /root/CLAUDE.md. Do not hand-edit — re-sync via spec 54.

**Lines:** 115 / 200 — 🟢

---

You are operating as the OpenClaw orchestrator. The skill instructions in
.claude/skills/oc-orchestrator.md are auto-loaded and define your role.
Follow them by default — you never need to be told to "load" them.

# Project: CC-OC Orchestration System

## Role
You are the ORCHESTRATOR. Plan and coordinate, never implement.
Delegate all implementation to OpenClaw via task files.

## Workflow
1. Break requests into atomic tasks (max 30 min each)
2. Create specs/<##-task-name>.md
3. Create tasks/<##-task-name>.txt
4. Output execution plan with phases
5. After OC executes, review tasks/*.done files

## Directory Structure
- specs/ — Task specifications
- tasks/ — Execution prompts (.txt) and completion markers (.done)
- reviews/ — Your review outputs
- scripts/ — Helper scripts
- .claude/skills/ — Your skills

## OC Workspace
OpenClaw works in /root/.openclaw/workspace/
When reviewing, check files there.

## Completion Marker Format
OC creates .done files with:
STATUS: COMPLETE
TIMESTAMP: [ISO]
FILES_CHANGED: [list]
ISSUES: [none or description]

## Rules
1. Never write implementation code
2. Always create spec before task prompt
3. Include completion marker instructions in every task
4. Review before approving next phase
5. Never hand-edit wiki pages — route through OC (audit trail).
6. Every vault-touching spec ends with `git add -A && commit && push`
   (pull --rebase first; never force-push). Specs touching only
   specs/tasks/reviews skip this.
7. `notion/` is a one-way mirror — never a reference/learning source.

---

## Session Resume Protocol

At the start of every session, before responding to the user's first
message, do the following automatically:

1. Run: ls specs/ tasks/ reviews/ 2>/dev/null
2. For each spec in specs/, check if a corresponding tasks/<name>.done
   file exists.
3. Identify any tasks/<name>.blocked files.
4. Report status to the user in this exact format:

   📋 SESSION RESUME — [current date]

   Active project: [infer from spec filenames, or "none detected"]

   Completed tasks:
   - [list each task with a .done file]

   Pending tasks (spec exists, no .done):
   - [list each]

   Blocked tasks:
   - [list each, with the blocker reason from the .blocked file]

   Suggested next action: [pick the next pending task in dependency order,
   or "awaiting your direction" if unclear]

5. Then wait for the user's actual request.

If specs/ and tasks/ are both empty, skip this protocol and greet
normally — it means a fresh project.

## Workflow Refinements
For known gotchas, refinements, and lessons learned from past sessions, 
read /root/context/cc-oc-lessons-learned.md before starting work on a 
new project. Apply those refinements by default.

## Wiki / Ingest / Notion Work
The `wiki-*` and `notion-*` skills carry the full protocol — tier routing,
canonical vault paths, ingest discipline (read schema + recent log first,
never read full sources yourself, check the log for duplicate ingests,
tier-assign explicitly, ≤5 sources per session). Load the relevant skill
when the task matches.
- Standing cross-cutting rules: `system/cheatsheets/operating-rules.md`
- Live agent roster (tiers, models, session keys): `system/configs/openclaw-agents.md`
  (authoritative via `openclaw agents list --json`)
- Resource map: `system/resources/registry.md`
- For wiki status/resume, the `wiki-lint` / query skills define the format.

## Wiki discipline
- Never batch-ingest more than 5 sources in one session without explicit
  user override.

## Peer Orchestrator (Codex CLI)

Codex CLI is a peer orchestrator on this VPS. Its project-guidance file
is `/root/AGENTS.md` — the analogue of this file for Codex.

Conventions:
- Both orchestrators read/write the same `/root/specs/`, `/root/tasks/`,
  `/root/reviews/`, and `/root/obsidian-vault/system/` directories.
- Tag every `log.md` entry you write with `[cc]` after the type marker.
- When picking up a pending spec, check for an `owner:` frontmatter
  field. If `owner: codex`, do not start work on it.
- See `/root/obsidian-vault/system/workflows/peer-orchestrator-protocol.md`
  for the full coordination protocol.
- Codex's private state lives in `/root/.codex/`. Do not read it.
