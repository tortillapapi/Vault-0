# Peer Orchestrator Protocol

_Last updated: 2026-04-27_

## Overview

A peer orchestrator is an operator CLI that can author specs, dispatch work to OpenClaw, and review completion markers using the same shared conventions. On this VPS, the two peer orchestrators are Claude Code (CC) and Codex CLI.

## Shared Resources

The following paths are shared working surfaces. Both orchestrators MAY read and write them according to the rules in this protocol:

- `/root/specs/` — specifications authored by either orchestrator.
- `/root/tasks/` — task prompts and `.done`, `.blocked`, `.progress`, and `.review` markers.
- `/root/reviews/` — review files produced by either orchestrator.
- `/root/obsidian-vault/system/` — shared operations knowledge, including skills mirror pages, workflows, decisions, glossary entries, cheatsheets, templates, and configs.
- `/root/context/` — shared session-resume context, including operational lessons such as `cc-oc-lessons-learned.md`.

## Private Resources

The following paths are private sidecars. Orchestrators MUST NOT read each other's private resources unless the user explicitly instructs them to do so for a one-off recovery task.

- CC private state: `/root/.claude/projects/-root/memory/` and `~/.claude.json`.
- Codex private state: `/root/.codex/memories/`, `/root/.codex/sessions/`, and `/root/.codex/history.jsonl`.
- Rule: shared knowledge belongs in `/root/obsidian-vault/system/`, not in another orchestrator's private directory.

## Spec Frontmatter

Specs MAY include an optional `owner:` field to indicate which orchestrator should run the spec. Valid values are `cc` and `codex`; omit the field when the spec is unowned.

```yaml
---
spec: 39-foo
owner: codex   # or cc; omit for unowned
---
```

Before starting a spec, an orchestrator MUST check frontmatter. If the owner is the other orchestrator, do not start work unless the user explicitly reassigns it.

## Log Discipline

Every new entry in `/root/obsidian-vault/log.md` MUST tag the writing orchestrator immediately after the `## [date] type |` header.

Examples:

```markdown
## 2026-04-27 ingest | [cc] Added Foo source
## 2026-04-27 decision | [codex] Adopted peer owner frontmatter
```

Existing untagged entries are historical and SHOULD be treated as CC-authored unless evidence says otherwise. Do not rewrite old log entries just to add tags.

## Session Start Protocol

At the start of a session, both orchestrators MUST:

1. Run the resume protocol defined in their local guidance file: CC uses `/root/CLAUDE.md`; Codex uses `/root/AGENTS.md`.
2. Check `/root/tasks/` for `.blocked` files older than 24 hours and surface them in the resume/status block.
3. Read the last 20 entries of `/root/obsidian-vault/log.md` for cross-orchestrator awareness before planning shared work.
4. Apply `/root/context/` lessons when starting new orchestration work.

## Dispatch Parity

Both orchestrators dispatch implementation or review work through the `openclaw` CLI as documented in `/root/obsidian-vault/system/cheatsheets/oc-cli-cheatsheet.md`. Both orchestrators MUST write task prompts with enough context for the receiving OpenClaw tier to execute without relying on private CC or Codex memory.

Both orchestrators MUST use the same completion marker style:

```text
STATUS: COMPLETE
TIMESTAMP: 2026-04-27T<HH:MM:SS>Z
FILES_CHANGED:
  - /path/to/file (created/modified/appended)
ISSUES: none
```

## Review Parity

Both orchestrators MAY write `.review` files in `/root/reviews/` or `/root/tasks/` when reviewing OpenClaw output. Review files SHOULD use this format:

```text
STATUS: ACCEPT | REJECT
TIMESTAMP: 2026-04-27T<HH:MM:SS>Z
REVIEWER: cc | codex
TARGET: /root/tasks/<task>.done
FINDINGS:
  - none | specific issue
REQUIRED_FIXES:
  - none | specific fix task
```

An ACCEPT review means the corresponding `.done` file satisfies the spec. A REJECT review MUST include concrete fixes and the exact file paths affected.

## Anti-Collision Rules

The user SHOULD run only one orchestrator at a time per project, or ensure CC and Codex are working on different specs.

Before dispatching work for a spec, an orchestrator MUST check for a corresponding `.progress` file. If that file has recent activity (mtime less than 30 minutes old), assume the other orchestrator is mid-flight and do not start duplicate dispatch on the same spec.

If a collision is discovered after work begins, stop new dispatches, append a `.blocked` marker explaining the overlap, and wait for user direction. Do not resolve collisions by editing the other orchestrator's private state.

## When To Use Which Orchestrator

Use whichever orchestrator has enough remaining quota and the right modality for the job. Codex is generally strong for code-heavy execution and mechanical engineering; CC is generally strong for workflow design, spec authorship, and skill-rich orchestration. These are preferences, not hard rules: owner frontmatter and explicit user instructions take priority.
