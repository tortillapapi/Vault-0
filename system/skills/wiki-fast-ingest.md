---
name: "wiki-fast-ingest"
description: "Low-friction single-turn ingest of a source into the Obsidian vault, done directly by CC with no grunt/mid dispatch. Use for personal notes, bookmarks, clips, and other low-stakes captures."
type: system-skill
maintainer: cc-oc-orchestrator
last_updated: 2026-06-23
---

# Wiki Fast Ingest

## Role
This is the **low-ceremony** counterpart to [[wiki-ingest-orchestrator]]. CC
reads the source and writes the wiki pages directly, in one turn, with no spec,
no grunt dispatch, and no mid review. The point is to make "drop a file, say
'ingest this'" genuinely one step, so the second brain actually gets fed and
compounds. Schema discipline still holds — typed pages, frontmatter,
`[[wikilinks]]`, log entry, commit + push.

## Fast lane vs. full loop — pick correctly
Use **fast ingest** (this skill) when the source is:
- A single, self-contained item: a bookmark, a clip, a short article, a thread,
  a transcript snippet, a personal note or idea.
- Low-stakes: getting it wrong costs nothing; it's capture, not canon.
- Small enough for CC to read directly without burning serious context
  (roughly < ~6k words / < ~40k chars).

Escalate to the **full loop** ([[wiki-ingest-orchestrator]]) when the source is:
- Large (a book, a long paper, a multi-hour transcript) or a batch of many.
- High-stakes / canonical: it will be cited, it reshapes a topic synthesis, or
  factual precision matters (research, decisions, anything load-bearing).
- Going to touch many existing pages and needs a review gate.

If unsure, do fast ingest but flag in the reply that it could warrant a fuller
pass.

## Trigger phrases
"ingest this", "fast ingest", "capture this", "drop this in the wiki",
"absorb this", "file this". A new file appearing in `raw/` that the user points
at also triggers it.

## Workflow (single turn)

### 1. Pre-flight (lean)
Read, in order:
- `/root/obsidian-vault/WIKI_SCHEMA.md` — the page contract.
- `/root/obsidian-vault/core-index.md` (or `index.md`) — what already exists, so
  existing entity/concept/topic slugs get reused instead of duplicated.
- Last ~15 lines of `/root/obsidian-vault/log.md` — dedupe check. If this source
  is already logged, stop and say so.

### 2. Land the raw source (immutable)
- If the user pasted text, write it verbatim to `raw/clips/<slug>.md` (or
  `raw/bookmarks/<slug>.md` for bookmarks). Never edit `raw/` after writing —
  it's the immutable record.
- If the source is already a file in `raw/`, just reference its path.

### 3. Read it directly
Unlike the orchestrator, CC DOES read the whole source here (that's the tradeoff
for skipping the review tiers). It's small by definition of the fast lane.

### 4. Write the source page
Create `wiki/sources/<slug>.md` per the schema's source frontmatter. For fast
captures, fill:
- `## Summary` — 1–3 tight paragraphs, neutral.
- `## Key Points` (or `## Key Claims`) — the substance, as a short list.
- `## Action Items` — **the actionable layer.** Concrete next steps this source
  implies for the user, or `None` if it's pure reference. This is what turns a
  bookmark from "saved and forgotten" into something doable.
- `## Wiki Pages Updated` — wikilinks to the pages touched.
Add `ingest_mode: fast` to the frontmatter so fast vs. full captures are
distinguishable later (and a fast page can be promoted to a full pass).

### 5. Categorize via links (this is the "folders")
The vault categorizes by **link graph**, not directories. So:
- Reuse existing `[[entity]]` / `[[concept]]` / `[[topic]]` slugs where they fit.
- Create thin new entity/concept pages only when a genuinely new, reusable thing
  appears (don't spawn a page per bookmark). A topic page is the right home for
  "a rolling pile of related bookmarks."
- For a bookmark, the topic/entity links ARE its categorization — e.g. a fitness
  TikTok links `[[fitness]]`; a startup thread links a concept + an entity. If
  the user already has the bookmark in a named folder (e.g. TikTok folders),
  map that folder name to a topic page so their existing categorization carries
  over (and can be optimized/merged over time).

### 6. Log + commit
- Append one `## [<UTC timestamp>] fast-ingest | <slug>` block to `log.md`
  (append-only — never rewrite history).
- `git -C /root/obsidian-vault add -A && git commit` with a one-line message,
  then push (vault commits must be pushed or Mac/GitHub/VPS drift).

### 7. Report back
One short summary: source page created, pages linked/created, and the Action
Items surfaced — so the user immediately sees what to *do*, not just that it
filed.

## Guardrails
- Never modify anything in `raw/`.
- Don't fabricate facts to fill sections; `None` / `Unknown` is fine.
- Don't create duplicate entity/concept pages — check the index first.
- If it's actually big or canonical, say so and offer the full loop instead.
- Keep CC context lean: one source per fast ingest unless it's a tiny batch.

## Relationship to the bookmarks project
This skill is the engine for the parked bookmarks project (TikTok/X/Reddit
saves → categorized, summarized, actionable). The future export automation just
drops items into `raw/bookmarks/` and batch-invokes this lane; the categorize +
summary + action-items mechanics are defined here.
