---
type: system-workflow
title: Lessons Learned
slug: lessons-learned
source_path: /root/context/cc-oc-lessons-learned.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, workflow, lessons]
---

## Purpose

Practical refinements for the CC-OC workflow, collected from real sessions. Consult this before kicking off a new project or when a workflow starts drifting into known failure modes.

## Contents

# CC-OC Workflow — Lessons Learned

Practical lessons from real orchestration sessions. Add these refinements on top of the base workflow in `cc-oc-orchestration-workflow.md` and `cc-oc-quick-reference.md`.

---

## Session start

### Use a status trigger, not silent autoload
CC won't speak first even with CLAUDE.md autoloaded. Open every session with a short status word like `status`, `resume`, or `where are we`. This fires the Session Resume Protocol and gives you a populated status block instead of a generic greeting.

### Archive completed projects before starting new ones
Stale specs/tasks from old projects clutter the status report and confuse CC about what's "active." Run this between projects:
```bash
mkdir -p /root/archive/<project-name-and-date>
mv /root/specs/*.md /root/tasks/* /root/output/* /root/archive/<project-name-and-date>/
```

---

## Skill discovery

### "Load the X skill" doesn't always work
If skills are autoloaded via `.claude/settings.json`, CC may not recognize "load the X skill" as a command — it'll go hunting for a tool that doesn't exist. Instead say: "You should already have the X instructions auto-loaded. Confirm you can see them, then act per those instructions."

### Better: bake the role into CLAUDE.md
A line like *"You are operating as the OpenClaw orchestrator. The skill instructions in .claude/skills/oc-orchestrator.md are auto-loaded and define your role. Follow them by default — you never need to be told to load them."* eliminates the discovery problem entirely.

---

## Task decomposition

### Always require a dependency graph before specs are written
Tell CC: *"Before writing any files, show me your proposed task breakdown and dependency graph so I can approve it."* Catches over- and under-decomposition before tokens are spent on spec files you'd need to redo.

### Re-order tasks when a later one informs an earlier one
Numbering ≠ execution order. Example from this project: task 04a (setup guide) was supposed to run last, but it references functions from 04b (sheet initializer). Running 04b first meant 04a could write accurate, final instructions in one pass instead of needing a follow-up.

### Tasks must be fully self-contained
OC has no memory between tasks and may not have a previous task's output file in its workspace. Every task prompt must inline all required schema, column counts, function signatures, and (when editing existing files) the expected file structure. Specs in `specs/` are short references; the real contract lives in `tasks/*.txt`.

---

## Directory mismatch (the persistent gotcha)

### CC and OC live in different directories
- CC reads/writes from `/root/` (specs, tasks, reviews)
- OC reads/writes from `/root/.openclaw/workspace/`

This causes three recurring problems:

1. **CC can't see OC's outputs by default.** Before any audit, copy OC's files to a CC-readable location:
   ```bash
   mkdir -p /root/output
   cp /root/.openclaw/workspace/*.gs /root/.openclaw/workspace/*.md /root/output/
   ```

2. **OC may put `.done` markers in `/root/.openclaw/workspace/tasks/` instead of `/root/tasks/`.** Either run a copy-back after each task, or accept it and write `.done` files manually.

3. **Tasks that build on previous outputs need full context inline.** If task 02a edits a file from task 01, the task 02a prompt must include the expected file structure verbatim — otherwise OC may not find the file in its workspace.

### Fallback: manual `.done` markers
If OC skips creating a `.done` file:
```bash
echo "STATUS: COMPLETE
TIMESTAMP: $(date -u +%Y-%m-%dT%H:%M:%SZ)
FILES_CHANGED: <path>
ISSUES: none" > /root/tasks/<task-name>.done
```

---

## OC execution

### "Parallel" tasks aren't actually parallel in the TUI
The CC orchestrator skill may produce execution commands with `&` and `wait` syntax. If you're pasting tasks into the OC TUI manually (no background `oc-run.sh` automation), this is theatrical — you're running sequentially. Tell CC: *"Tasks should be self-contained enough that order doesn't matter, but I run them sequentially. Drop the &/wait syntax."*

### Always paste with the trigger phrase
OC responds best when task content is prefixed with `Execute this task now:` followed by a blank line, then the full task text. Without the prefix, OC may interpret pasted content as a question or status update.

---

## Verification cadence (the most important habit)

### Always `cat` the output before running the next dependent task
After every OC task that produces a file another task will modify, run `cat /root/.openclaw/workspace/<file>` and inspect the result. Catches drift in function names, CONFIG keys, or stub signatures *before* the next task silently edits the wrong thing.

### What to check on each `cat`
- Does the file have the expected structure (sections, banners)?
- Are function names and signatures what later tasks will reference?
- Are there leftover stubs or TODOs that should have been replaced?
- Did OC accidentally rewrite sections it was told to leave alone?

### Don't audit too early
A full CC audit has highest value *after the last code task*, not after each one. Auditing mid-build means re-auditing later when subsequent tasks modify files. Save it for the end.

---

## The end-of-build audit

### Single audit prompt, focused on cross-file consistency
Real audit value isn't checking individual files (you've been doing that with `cat`) — it's catching mismatches between files that no single-file review can spot. The prompt template:

```
All [N] tasks are complete. Run the cross-file audit before I deploy.

Files to review: [list paths in /root/output/]
Specs to compare against: /root/specs/*.md
Completion markers: /root/tasks/*.done

Apply the review-oc-work skill, but pay special attention to cross-file 
consistency:
1. Do all function names referenced in docs actually exist in code?
2. Do column counts and headers match across all schema definitions?
3. Do CONFIG keys mentioned in setup guides match what's defined in code?
4. Are tab/table/entity names consistent across all files?
5. Are there leftover stubs, TODOs, or unimplemented placeholders?
6. Do any column-letter or position references line up with actual headers?

Report APPROVED, or list specific inconsistencies — and for each issue, 
propose whether it needs a fix task or can be patched manually.
```

---

## Two-layer model

### The Claude.ai project is your guide; the VPS is where work happens
- Files in your Claude Project knowledge are invisible to CC on the VPS.
- If CC needs context from a project doc, you have to paste it onto the VPS first (heredoc, scp, or paste-into-CC-chat).
- Consider mirroring critical context docs to a `/root/context/` directory on the VPS so they're always available without shuttling.

### Each Claude is isolated
- This Claude (in the project chat) doesn't see your VPS.
- CC on the VPS doesn't see this conversation.
- Each new CC session starts fresh except for `CLAUDE.md` and skills.
- You are the connective tissue — assume nothing carries across the boundary.

---

## Cost/effort calibration

### A 6-task project takes roughly:
- 5–10 min: kickoff prompt + CC dependency-graph proposal + your approval
- 30–60 min: OC execution (sequential, with `cat` checks between tasks)
- 5–10 min: final cross-file audit
- **Total: ~1–1.5 hours of attended time** for a multi-file production system

If a project is shaping up to need 15+ OC tasks, consider whether it should be split into two projects, or whether some tasks should be merged.

---

## CC ↔ OC communication

### Use `message send` for delivery, not `agent --deliver`
`openclaw agent --deliver` spins up a full LLM inference turn (~60s+) and locks the session file, causing cascading failures on retry. `openclaw message send` is a direct relay (~10s) with no inference overhead.

```bash
# Text
openclaw message send --channel telegram --target <chatId> -m "text"

# File as downloadable document
openclaw message send --channel telegram --target <chatId> -m "caption" --media /path --force-document
```

### Reserve `openclaw agent` for tasks that need LLM reasoning
Only use `openclaw agent` when you need OC to *think* — e.g., running the email-parser subagent, or delegating a task that requires inference. For anything that's just relaying content (sending files, notifications, status updates), use `message send`.

### Telegram message length limit is 4096 chars
For content longer than 4096 characters, send as a file (`--media` + `--force-document`) rather than trying to send inline. Markdown files work well as downloadable documents.

### Always capture messageId with `--json`
If you might need to edit or delete a sent message later, add `--json` to get the `messageId` back in the response. Store it for follow-up operations.

### Session locks from `openclaw agent` are sticky
If an agent command times out or is killed, it can leave a `.lock` file in `/root/.openclaw/agents/<id>/sessions/`. Clear it with `rm -f /root/.openclaw/agents/<id>/sessions/*.lock` before retrying.
