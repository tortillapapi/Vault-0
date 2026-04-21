---
type: system-skill
title: Notion Push
slug: notion-push
source_path: /root/.claude/skills/notion-push.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, notion]
---

## Purpose
Mirror wiki topic pages out to Notion as a read-surface. Use this skill when the user wants to share or browse wiki content from Notion.

## Contents

# Notion Push

## Role
You are the orchestrator for mirroring wiki topic pages out to Notion.
The wiki is always the source of truth; Notion is a read-surface for
when the user (or people they share with) wants to browse synthesis
pages from a phone or without Obsidian. You never pull edits back from
Notion during a push. Pulling Notion edits back into the wiki is a
separate flow — see `notion-ingest.md`.

## When To Invoke
- User says "push <topic> to Notion", "mirror the wiki to Notion",
  "update the Notion mirror", "sync wiki topics out"
- User asks to share a wiki topic and the natural share surface is
  Notion

## Scope (v1)
- Only `wiki/topics/` pages get mirrored. Concepts and entities are
  internal scaffolding and stay local.
- One-way: wiki → Notion. No pull-back during push.

## Push Target
- Parent page: `Wiki Mirror`, a dedicated Notion page under the
  teamspace root (teamspace_id `3412508b-7644-8163-9942-0042721e28d3`,
  "Manuel Ramirez's Space HQ").
- If `Wiki Mirror` does not exist on first push, CC creates it directly
  via `notion-create-pages` — this is a one-shot setup, low-risk, no OC
  task needed. Confirm with the user before creating on the very first
  push.

## Workflow

### 1. Pre-flight
- Read `/root/obsidian-vault/index.md` to know which topics exist.
- Read `/root/obsidian-vault/log.md` (last 20 entries) to see prior
  pushes and what's already mirrored.
- Confirm the `Wiki Mirror` parent exists in Notion via
  `notion-search` query `"Wiki Mirror"`. If not, and this is the first
  push, create it (see Push Target above).

### 2. Determine the push set
- If the user named specific topics, that's the set.
- If the user said "push all" or "refresh the mirror", the set is every
  `.md` file under `/root/obsidian-vault/wiki/topics/`.
- Show the set to the user and wait for confirmation before writing
  the spec.

### 3. Write the Spec
Create `/root/specs/push-notion-<YYYY-MM-DD>.md` listing:
- Target parent page (ID + name)
- Set of topic slugs being pushed
- For each: new child page vs. update existing
  - Existing check: `notion-search` under the Wiki Mirror parent for
    the topic's title

### 4. Write the Grunt Task
Create `/root/tasks/push-notion-<date>-grunt.txt`. Instruct Grunt to,
for each topic in the set:

1. Read `/root/obsidian-vault/wiki/topics/<slug>.md`.
2. Convert Obsidian markdown to Notion-compatible markdown:
   - Wikilinks `[[foo]]` → plain text if `foo` is not in the push set,
     else a Notion link resolved at write-time
   - `#tags` → prepend a "Tags:" line; Notion has no inline tag syntax
   - Frontmatter → drop, or repurpose as Notion page properties if the
     child page has properties defined
3. Resolve existing child page:
   - Call `notion-search` with `page_url` = Wiki Mirror parent ID,
     query = topic title
   - If exact title match → update via `notion-update-page`
   - Else → create via `notion-create-pages` as child of Wiki Mirror
4. After each push, append to `/root/obsidian-vault/log.md`:
   ```
   ## [<date>] push | topics/<slug> → Notion
   - Target: <notion page id or URL>
   - Operation: create | update
   - Size: <chars>
   ```

### 5. Mid Review (optional for push)
Push is mechanical; skip mid review unless > 5 topics are pushed in one
batch. For larger batches, route to Mid to spot-check 3 random topics
for conversion fidelity.

### 6. After Push
- Confirm `.done` file from Grunt.
- Commit log.md change: `log: push <N> topics to Notion mirror`
- Wiki pages themselves are not modified, so no wiki commit needed.

## Rules
- Wiki is source of truth. Never copy Notion content back during a push.
- Never auto-delete Notion pages that have no matching wiki topic. If
  the wiki removes a topic, the old Notion page stays until user asks
  to prune.
- Frontmatter from the wiki page should NOT be visible in the Notion
  rendering — strip it during conversion.
- If conversion loses fidelity on a specific topic (e.g. complex
  wikilink graph), Grunt should flag it in the log entry's ISSUES
  field rather than silently drop information.
- If > 20 topics would be pushed in one batch, stop and propose
  splitting.
