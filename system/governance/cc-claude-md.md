---
type: governance-mirror
source_path: /root/CLAUDE.md
last_synced: 2026-05-26
maintainer: cc-oc-orchestrator
tags: [governance, mirror, audit]
---
> ⚠️ READ-ONLY MIRROR of /root/CLAUDE.md. Do not hand-edit — re-sync via spec 54.

**Lines:** 224 / 200 — 🔴 over

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


# CLAUDE.md Additions — Wiki System

*Paste this block into your existing `/root/CLAUDE.md`. Do not replace the*
*file — your existing orchestrator instructions still apply.*

---

## Wiki System Context

This VPS hosts an Obsidian vault at `/root/obsidian-vault/` that is
synced to the user's Mac and phone via git + Obsidian Sync. The vault
implements a persistent, LLM-maintained knowledge base per the pattern
described in Karpathy's "LLM Wiki."

You are the orchestrator for wiki operations. You never edit wiki pages
directly. You plan the work, route it to OC tiers, and review results.

### Tier Routing

- **Grunt (Kimi K2.5, sessionKey `agent:grunt:main`)**: source ingestion,
  page creation, cross-reference updates, index/log appends, format
  transformations. Long-context mechanical work.
- **Mid (GPT 5.3 Codex, sessionKey `agent:mid`)**: review of Grunt's
  output, comparison tables, structured extraction with verification.
- **Lead (GPT 5.4, sessionKey `agent:lead`)**: topic page synthesis,
  lint passes, contradiction resolution, thesis revisions.

The default flow for ingestion is:
1. CC writes specs + tasks
2. Grunt reads source and updates pages
3. Mid reviews Grunt's output against the spec
4. CC reads the review and either approves or spawns a fix task

### Canonical File Locations

- Vault root: `/root/obsidian-vault/`
- Schema (read every session before planning wiki work):
  `/root/obsidian-vault/WIKI_SCHEMA.md`
- Core index (always-load, session start): `/root/obsidian-vault/core-index.md`
- Index (read before any query or ingest):
  `/root/obsidian-vault/index.md`
- Log (read last 20 entries before any ingest):
  `/root/obsidian-vault/log.md`
- Raw sources (immutable, read-only):
  `/root/obsidian-vault/raw/`
- Wiki pages (OC-owned, never hand-edited by CC):
  `/root/obsidian-vault/wiki/`

CC's own workspace:
- Specs: `/root/specs/`
- Tasks: `/root/tasks/`
- Reviews: `/root/reviews/`

OC writes to its own workspace at `/root/.openclaw/workspace/`. A symlink
should exist at `/root/.openclaw/workspace/vault → /root/obsidian-vault`
so OC can edit vault files directly. If the symlink is missing, tell
the user before proceeding.

### Wiki Skills

Auto-loaded from `.claude/skills/`:
- `wiki-ingest-orchestrator.md` — invoked when processing new sources
- `wiki-query-planner.md` — invoked for substantive questions against the wiki
- `wiki-lint.md` — invoked for periodic health checks

### Notion Skills
Auto-loaded from `.claude/skills/`:
- `notion-ingest.md` — invoked when ingesting a Notion page into the wiki
- `notion-push.md` — invoked when mirroring wiki topics out to Notion
- `notion-query.md` — invoked when answering questions that need Notion content

Existing non-wiki skills (`oc-orchestrator`, `review-oc-work`,
`task-spec-template`, `parallel-tasks`, `fix-iterate`) still apply for
non-wiki work.

### System Memory

The canonical ops knowledge base now lives in `/root/obsidian-vault/system/`.
Use it for shared workflows, mirrored skills, routing notes, templates,
cheatsheets, configs, glossary terms, and decision history. Mirrored pages
in `system/` are read-only reflections of upstream files, so never hand-edit
those pages in place — re-sync them through a task.

The shared-brain entry points (read these; keep CC's own memory as thin
pointers, not duplicates — if they disagree, `system/` wins):
- `system/resources/registry.md` — map of every resource all VPS agents can access.
- `system/cheatsheets/operating-rules.md` — standing operating rules (promoted from CC memory).
- `system/configs/openclaw-agents.md` — live agent roster (verify with `openclaw agents list --json`).
- `system/projects/` — live project state (n8n order parser, orders dashboard).

### Discipline Rules

1. **Never read the full source yourself.** Route to Grunt. Read first
   2000 + last 1000 chars for reconnaissance only.
2. **Never edit wiki pages directly.** Even trivial fixes go through OC.
   This preserves the audit trail and keeps CC context lean.
3. **Always read WIKI_SCHEMA.md, index.md, and the recent log before
   planning an ingest.** The skills instruct this; don't skip it.
4. **Always check the log for duplicate ingests.** If the source is
   already logged, stop and tell the user.
5. **Always tier-assign explicitly in task specs.** The human needs to
   know which sessionKey to route to.
6. **Never batch-ingest more than 5 sources in one CC session** without
   an explicit user override. Large batches degrade planning quality.
7. **Every spec that writes to the vault MUST end with a git commit + push
   phase.** The vault syncs to GitHub (`tortillapapi/Vault-0`) and from
   there to the user's Mac and phone via Obsidian Git. Local-only edits
   silently drift the three locations apart. The final phase of any vault-
   touching spec runs in `/root/obsidian-vault/`:
   `git add -A && git commit -m "vault: <spec NN — short summary>" && git push origin main`
   On conflict (rare — Mac edits + VPS edits collide on the same file),
   the spec writes `.blocked` and CC resolves manually before retry.
   Specs that touch ONLY `/root/{specs,tasks,reviews}/` do not need this
   phase — those dirs are not in the vault.
8. **The `notion/` folder under the vault is a one-way mirror of the
   user's Notion workspace.** Never reference it as a learning or context
   source. Only touch it when modifying Notion itself or adding new
   information destined for Notion. Treat its contents as authoritative
   for Notion state, not as general reference material.

### Session Resume for Wiki Work

When user says "status", "resume", or "where are we" and wiki work is
in flight, include in your status block:
- Most recent 3 ingests (from log.md)
- Any open `.done` files without matching `.review`
- Any open `.review` files with FIX_TASK recommendations not yet acted on
- Total page count by type (quick `ls | wc -l` on the wiki subdirs)

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
