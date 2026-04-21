---
type: system-skill
title: Wiki Lint
slug: wiki-lint
source_path: /root/.claude/skills/wiki-lint.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, wiki]
---

## Purpose
Periodic health-check of the wiki to surface cross-cutting issues. Use this skill after batch ingests or on weekly cadence to audit vault integrity.

## Contents

# Wiki Lint

## Role
Periodic health-check of the wiki. Surface problems the ingest/review
loop can't catch — cross-cutting issues that only appear when you look
at the wiki as a whole.

## When To Invoke
- User says "lint the wiki", "health check", "audit the vault"
- Weekly cadence (if you set up a cron reminder)
- After a batch ingest of 10+ sources, before moving on

This is expensive work. Don't run it after every single ingest.

## Workflow

### 1. Gather Stats
Before routing to a tier, collect cheap signals:

```bash
# Page counts by type
ls /root/obsidian-vault/wiki/entities | wc -l
ls /root/obsidian-vault/wiki/concepts | wc -l
ls /root/obsidian-vault/wiki/topics | wc -l
ls /root/obsidian-vault/wiki/sources | wc -l

# Pages changed in last 7 days
find /root/obsidian-vault/wiki -name "*.md" -mtime -7 | wc -l

# Recent ingests
grep "^## \[" /root/obsidian-vault/log.md | tail -20

# Candidate orphans (pages with no inbound wikilinks)
# — rough heuristic only, grep won't catch all variants
for f in /root/obsidian-vault/wiki/**/*.md; do
  slug=$(basename "$f" .md)
  count=$(grep -r "\[\[$slug\]\]" /root/obsidian-vault/wiki --include="*.md" | wc -l)
  if [ "$count" -eq 0 ]; then echo "ORPHAN: $f"; fi
done
```

Record these numbers. They go into the lint report.

### 2. Decide Scope
Small wiki (<100 pages): full lint in one Lead task.
Medium wiki (100-500 pages): split by category — entities lint, concepts
lint, topics lint as separate tasks.
Large wiki (>500 pages): sample-based lint — pick 20% randomly plus all
pages changed in the last 7 days.

### 3. Write the Lint Task
Route to **Lead** (GPT 5.4). Lint requires holding many pages in mind
and reasoning about consistency. Grunt and Mid aren't reliable here.

Create `/root/tasks/lint-<date>.txt`:

```
Execute this task now:

TIER: Lead (GPT 5.4)
TASK: lint-<YYYY-MM-DD>

OBJECTIVE:
Perform a health check of the wiki. You are looking for cross-cutting
problems that individual ingest reviews cannot catch. Do not edit any
files. Produce a structured report only.

SCOPE:
<full | category:entities | category:concepts | category:topics | sample>

PAGES IN SCOPE:
<explicit list of paths>

SCHEMA REFERENCE:
/root/obsidian-vault/WIKI_SCHEMA.md

CHECKS TO PERFORM:

1. Contradictions across pages
   - Find pairs of pages that make conflicting claims about the same
     entity or concept.
   - Report each as: claim A (page + quote) vs claim B (page + quote),
     with a suggested resolution (which page is likely correct, or
     whether both should cite their sources and hedge).

2. Stale claims
   - Pages whose `last_updated` is >90 days old AND whose topic has
     seen newer ingests. Flag as "may be superseded."
   - Pages that reference events or states that are time-bound
     ("as of 2024", "currently", "will") without a date qualifier.

3. Orphan pages
   - Pages with zero inbound wikilinks from any other page.
   - For each orphan, suggest which existing page(s) should probably
     link to it, or whether it should be merged into a larger page, or
     whether it should be deleted.

4. Missing pages
   - Concepts or entities mentioned in 3+ pages but without their own
     dedicated page. List candidates with mention counts.

5. Broken wikilinks
   - `[[target]]` references to pages that don't exist. Group by target.

6. Inconsistent naming
   - Same entity referenced by multiple slugs (e.g. [[tesla-inc]] and
     [[tesla]]). Propose canonical name.

7. Frontmatter drift
   - Pages whose frontmatter diverges from the schema (missing fields,
     wrong types, unexpected fields).

8. Index drift
   - Entries in index.md that no longer match the page they reference.
   - Pages that exist but are not in index.md.

9. Data gaps worth filling
   - Topics that are under-sourced (topic page cites <3 sources).
   - Questions the wiki raises but doesn't answer.
   - Suggest web searches or specific source types that would fill
     the gap.

OUTPUT:
Write a report to /root/reviews/lint-<YYYY-MM-DD>.md with this structure:

# Lint Report — <date>

## Summary
<2-3 paragraphs: overall wiki health, biggest concerns, quick wins>

## Stats
- Total pages: <n>
- Pages in scope: <n>
- Issues found: <breakdown by check>

## Contradictions
<numbered list with quotes and suggested resolutions>

## Stale Claims
<numbered list with freshness indicators>

## Orphans
<numbered list with linking suggestions>

## Missing Pages
<ranked list by mention count>

## Broken Wikilinks
<grouped by broken target>

## Inconsistent Naming
<grouped by canonical candidate>

## Frontmatter Drift
<list of files + specific field problems>

## Index Drift
<add / remove / update entries needed>

## Data Gaps
<prioritized research prompts>

## Recommended Actions
<ordered list of concrete next ingests / fixes / schema changes,
prioritized by impact>

WHEN COMPLETE:
Create /root/tasks/lint-<date>.done pointing to the report.
```

### 4. Review the Report With User
The report will typically have dozens of findings. Don't auto-act on any
of them. Read through with the user and decide:

- Quick fixes (broken wikilinks, frontmatter drift, index drift): batch
  into a single Grunt fix task.
- Content fixes (contradictions, stale claims, orphans): decide case by
  case. Some become new ingest tasks; some are deletions; some need more
  source material.
- Schema changes: human decision, not LLM.
- Research prompts: user decides which to pursue; each becomes a source
  hunt, not an immediate wiki edit.

### 5. Log It
Append to `log.md`:
```
## [<date>] lint | scope: <full | category | sample>
- Pages reviewed: <n>
- Issues found: <breakdown>
- Report: reviews/lint-<date>.md
- Actions taken: <summary>
```

## Rules

- Lint is read-only. Nothing gets edited during a lint task.
- Always route lint to Lead. It's the one place where cheaper tiers
  reliably underperform.
- Don't auto-act on findings. Lint produces a report; the user drives
  which findings become work.
- Run lint *after* a batch of ingests, not before. Linting a fast-moving
  wiki produces noise.
- Small wikis (<50 pages) often don't need lint at all. Skip until there's
  enough content for cross-cutting issues to exist.
