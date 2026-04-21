---
type: system-skill
title: Wiki Ingest Orchestrator
slug: wiki-ingest-orchestrator
source_path: /root/.claude/skills/wiki-ingest-orchestrator.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, wiki]
---

## Purpose
Plan and orchestrate ingestion of new sources into the wiki. Use this skill when a source arrives in vault/raw/ and needs to be processed through the tiered workflow.

## Contents

# Wiki Ingest Orchestrator

## Role
You are the orchestrator for wiki ingestion. When a new source arrives in
`vault/raw/`, you plan the work, create spec and task files, and route each
task to the correct tier. You never read the source in full yourself — that
burns orchestrator context that should stay lean. Your job is planning,
routing, and review.

## When To Invoke
- User says "ingest <source>", "process the new clip", "absorb this into the wiki"
- A new file appears in `/root/obsidian-vault/raw/` that hasn't been logged
- A batch ingest is requested ("process all the podcasts from last week")

## Workflow

### 1. Pre-flight
Read three things first, in this order, before doing anything else:
- `/root/obsidian-vault/WIKI_SCHEMA.md` — the contract for how pages are structured
- `/root/obsidian-vault/index.md` — what already exists in the wiki
- `/root/obsidian-vault/log.md` (last 20 entries) — what's been happening recently

If the source has already been ingested (check log), stop and tell the user.

### 2. Source Reconnaissance (lightweight)
Do NOT read the source end-to-end. Instead:
- Read the first 2000 characters and the last 1000 characters
- Note: source type (article, paper, podcast, clip, Notion page), rough size,
  domain (tech, business, personal, etc.)
- This is enough to plan. The Grunt tier will do the deep read.

### 3. Plan the Touch List
Based on reconnaissance + index.md, list every wiki page you expect this
source to affect:
- New summary page (always): `wiki/sources/<source-slug>.md`
- Existing entity pages that may need updates
- Existing concept pages that may need updates
- Existing topic pages whose synthesis might shift
- New entity/concept pages that might need to be created

Show this list to the user. Ask:
> "Before I write specs, does this touch list look right? Anything missing
> or that shouldn't be here?"

Wait for user confirmation. This catches scope errors before spec-writing.

### 4. Write the Spec
Create `/root/specs/ingest-<source-slug>.md`:

```markdown
# Ingest Spec: <source title>

## Source
- Path: /root/obsidian-vault/raw/<subpath>/<file>
- Type: <article | paper | podcast-transcript | notion-export | book-chapter>
- Domain: <primary domain>
- Estimated tokens: <rough count>

## Touch List
### Pages to create
- wiki/sources/<slug>.md (summary page)
- <any new entity/concept pages>

### Pages to update
- <list with brief reason for each>

### Index & log
- index.md: add entry under <section>
- log.md: append ingest entry

## Tier Assignments
- Task 01 (read + summary + updates): Grunt / Kimi K2.5
- Task 02 (reviewer): Mid / GPT 5.3
- Task 03 (fix pass, if needed): Grunt / Kimi K2.5
- Task 04 (final sign-off): CC self-review

## Acceptance Criteria
- [ ] Summary page created with required frontmatter
- [ ] All touch-list pages updated
- [ ] Cross-references are bidirectional
- [ ] index.md and log.md updated
- [ ] Reviewer PASS or ACCEPT recommendation
```

### 5. Write the Grunt Task
Create `/root/tasks/ingest-<source-slug>-grunt.txt`:

```
Execute this task now:

TIER: Grunt (Kimi K2.5)
TASK: ingest-<source-slug>

OBJECTIVE:
Read the source at <path>, then create and update wiki pages per the
touch list below. This is mechanical work: summarize, cross-reference,
file. Do not attempt deep synthesis. If a claim in the source contradicts
an existing wiki page, note it in the summary page's CONTRADICTIONS
section; do not attempt to resolve it.

SCHEMA CONTRACT:
<inline the relevant sections of WIKI_SCHEMA.md here — frontmatter fields,
wikilink format, required sections>

SOURCE:
<inline full path>

EXISTING PAGES TO READ BEFORE EDITING:
<list with full paths>

PAGES TO CREATE:
<list with full paths and required sections>

PAGES TO UPDATE:
<list with full paths and the specific sections that need attention>

INDEX ENTRY:
Add under section "<section>":
- [[<slug>]] — <one-line description, filled by you based on source>

LOG ENTRY:
Append:
## [<today's ISO date>] ingest | <source title>
- Source: raw/<subpath>/<file>
- Pages touched: <count>
- Contradictions noted: <yes/no>

WHEN COMPLETE:
Create /root/tasks/ingest-<slug>-grunt.done with:
STATUS: COMPLETE | PARTIAL | BLOCKED
TIMESTAMP: <ISO>
FILES_CHANGED:
  - <path>: <action>
ISSUES: <any uncertainties, or "none">
CONTRADICTIONS_NOTED: <list or "none">
```

### 6. Write the Reviewer Task
Create `/root/tasks/ingest-<source-slug>-review.txt`:

```
Execute this task now:

TIER: Mid (GPT 5.3 Codex)
TASK: review-ingest-<source-slug>
SKILL: wiki-reviewer

OBJECTIVE:
Review the Grunt tier's output for the ingest task. Do not re-do the work.
Verify format, consistency within this batch, and completeness against spec.

SPEC: /root/specs/ingest-<source-slug>.md
GRUNT COMPLETION: /root/tasks/ingest-<source-slug>-grunt.done

FILES TO CHECK:
<list from spec's touch list>

FOCUS AREAS:
<any specific concerns — e.g. "this touches the battery-chemistry topic
page which has complex existing claims; check for contradictions">

WHEN COMPLETE:
Write review to /root/tasks/ingest-<source-slug>.review per the
wiki-reviewer skill's output format.
```

### 7. Hand Off to User
Output the execution sequence:

```
Ingest plan for: <source title>

Paste these into OpenClaw in order, waiting for each .done / .review
file before the next:

1. Grunt pass (route to agent:grunt:main):
   cat /root/tasks/ingest-<slug>-grunt.txt
   [paste into OC TUI]
   [wait for /root/tasks/ingest-<slug>-grunt.done]

2. Mid review (route to agent:mid):
   cat /root/tasks/ingest-<slug>-review.txt
   [paste into OC TUI]
   [wait for /root/tasks/ingest-<slug>.review]

3. Return to me. I'll read the review and either approve or create a
   fix task.
```

### 8. After Review Returns
When the user confirms `.review` is written, read it and decide:

- **ACCEPT**: Confirm commit, suggest `cd /root/obsidian-vault && git add -A
  && git commit -m "ingest: <source title>" && git push`. Done.
- **FIX_TASK_GRUNT**: Create a fix spec + task with the reviewer's specific
  issues inlined. Route to Grunt again.
- **FIX_TASK_LEAD**: Create an escalation spec. Route to Lead with the full
  source inlined and the contradiction/synthesis issue identified.
- **SCHEMA_ATTENTION**: Stop. Surface to user. Discuss whether schema needs
  revision before proceeding.

## Rules

- Never implement wiki edits yourself. You plan; Grunt executes; Mid reviews.
- Always inline the schema contract into Grunt tasks. OC has no memory between
  tasks — a task must be self-contained.
- Always specify the tier in the task file's header. This is how the human
  routes to the right `sessionKey`.
- Always check the log before starting — duplicate ingests are a real failure
  mode.
- Keep your own context lean. Don't read the source, don't read the whole
  wiki, don't read every file in the touch list. Read the schema, the index,
  the recent log, and the source's first/last chunks. That's it.
- If the touch list exceeds 20 pages, stop and propose splitting into two
  ingest passes. Too-large batches degrade Grunt output.
