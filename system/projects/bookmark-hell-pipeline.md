# Bookmark Hell Pipeline

Status: **ACTIVATED 2026-07-09 — MVP v1 spec ready** (`/root/specs/171-bookmark-hell-pipeline-mvp1.md`); ingestion+extraction core built & piloted 2026-06-23
Owner/orchestrator: Hermes/Janus (plan) · Metis/CC (2026-06-23 build)
Captured: 2026-06-10T20:03:15Z · Updated: 2026-06-23

## 2026-07-09 activation (Metis/CC)

Papi activated the project and locked all open decisions:
hybrid storage (SQLite source of truth + one-way Notion visual mirror w/
status-only read-back), `<url> [note]` Telegram capture, bulk-50 calibration
run first (then checkpoint before the 2,011 backlog), seed taxonomy of 6
categories + tags mined from his 66 TikTok collection names, transcript-first
classification with a confidence gate, categories grow only by cluster
proposal. Full plan: spec 171 (6 phases; digests/resurfacing parked as Phase 6).
Handoff for the build session: `/root/context/metis-handoff-bookmark-hell-2026-07-09.md`.

## 2026-06-23 update — the engine is built (Metis/CC)

The hard middle of this plan — capture → transcript → summary → category →
next-action, stored in Obsidian — now exists and is proven on real bookmarks.

**What's built:**
- **Fast-ingest lane** ([[wiki-fast-ingest]]) — a low-friction, single-turn CC
  ingest (no spec/grunt/mid). This is the "extractor" layer (steps 2–3 of the MVP).
  Schema gained `source_type: bookmark`, `ingest_mode: fast`, and a required
  `## Action Items` section (the "next action" field this plan wanted).
- **Local transcription** — `/root/scripts/tiktok-transcribe.py` (venv
  `/opt/stt-venv`): `yt-dlp` audio → `faster-whisper` base/int8, CPU, **no API
  key, no cost**. Returns creator + caption + duration + transcript JSON. Works
  for any yt-dlp source (TikTok **and YouTube/Reels**). This delivers the
  "transcript/text when available" extraction field — and it's decisive: captions
  routinely mislabel a clip; transcripts re-categorize on real content.
- **Storage** = Obsidian, link-graph categorization. A TikTok folder maps to a
  topic page (e.g. [[ai]]); each video is a `bookmark` source page with summary +
  key points + action items + verbatim transcript in `raw/bookmarks/`.

**Piloted:** the TikTok "AI" collection (`@tortilla_papi/collection/AI`), 4 videos,
end-to-end. See [[ai]]. Two of them turned out to describe this very project
(RAG-for-Claude-Code; DIY second-brain w/ vector embeddings).

**Hard wall confirmed:** TikTok *collection contents* are not server-scrapable
(signed/authenticated API + captcha from datacenter IP). So the feed is
user-driven: paste links, or use the TikTok "Download your data" export (JSON) —
that list is then batch-run through the transcription script + fast-ingest.

**Still parked (matches Hermes plan below):**
- Automated bookmark *pull* per platform (MVP v3) — TikTok especially is manual/export-only.
- Structured SQLite/Sheet mirror for filters/dedupe/digest (currently Obsidian-only).
- Resurfacing (weekly Loot Drop, ADHD pick-one, trip mode).
- Optional **vector/semantic retrieval** layer over the wiki (raised by the dylanworr + Colton pilot clips).
- Deciding whether to keep one big folder/topic or auto-split into tighter categories as volume grows.

**2026-06-24:** Papi's full TikTok export analyzed (2,011 favorites + 6,000 likes
+ 67 folder NAMES, but no folder→video mapping and no captions in the export). The
bulk-ingest plan is written up and PARKED pending Papi's scope decisions — see
`/root/specs/152-tiktok-bookmarks-bulk-ingest.md`. Export stashed at
`/root/bookmarks-data/tiktok-export-2026-06-24.json` (out of git). Gateway now
accepts `.json/.zip/.csv/.txt` drops.

The original plan (unchanged) follows.

## Goal

Turn Papi's X/Twitter and TikTok bookmark hell into an actionable, searchable system for saved AI/automation tips, recipes, places to visit, reselling/business ideas, and personal improvement content.

The point is not to create another pretty archive where ideas go to die. The system should turn saved links into summaries, categories, next actions, and timely resurfacing.

## Current agreed direction

Start with a workflow pipeline we know works before trying to scrape every platform perfectly.

Recommended MVP:

1. Papi shares/forwards X, TikTok, article, YouTube, or other links to Telegram.
2. A deterministic capture pipeline stores the URL and metadata.
3. An agent/extractor summarizes and classifies the item.
4. Storage uses a hybrid model:
   - structured database/Sheet/SQLite for raw searchable records,
   - Obsidian for indexed knowledge and curated notes,
   - Notion or Google Drive views later for visual browsing/dashboards.
5. A scheduled digest resurfaces the best items with suggested next actions.

## System layers

### 1. Ingestion

Initial approach: do not fight platform APIs first. Build a reliable share-to-Telegram / paste-link pipeline.

Possible sources:

- Telegram shared links from Papi.
- Batch lists of URLs pasted into chat.
- X/Twitter bookmark API or `xurl` later if access/plan supports it.
- TikTok browser automation or mobile share workflow later.

MVP rule: anything Papi sends to the capture bot should get processed beautifully even if full account bookmark scraping comes later.

### 2. Extraction

For each item, extract or infer:

- platform/source,
- original URL,
- author/account,
- title or short description,
- transcript/text when available,
- summary,
- category,
- tags,
- actionability type,
- priority,
- suggested next action,
- resurfacing context.

Actionability types:

- actionable,
- reference,
- inspiration,
- junk/ignore.

### 3. Storage

Agreed preference: Option D / hybrid storage.

- Obsidian: best for indexed/searchable long-term knowledge.
- Google Sheet or SQLite: best for structured rows, filters, dedupe, batch review, and automation.
- Notion/Drive: later visual browsing layer if useful.

Potential structured fields:

- `id`
- `url`
- `canonical_url`
- `platform`
- `captured_at`
- `author`
- `title`
- `summary`
- `category`
- `tags`
- `actionability`
- `priority`
- `status`
- `next_action`
- `resurface_context`
- `notes`

Potential Obsidian curated notes:

- `Bookmark Hell/AI Automation.md`
- `Bookmark Hell/Recipes.md`
- `Bookmark Hell/Places.md`
- `Bookmark Hell/Business & Reselling.md`
- `Bookmark Hell/ADHD & Personal Systems.md`

### 4. Resurfacing

The system only matters if it brings useful things back at the right time.

Candidate modes:

- Weekly Bookmark Loot Drop: 5-10 worthwhile saved items with next actions.
- Pick-one ADHD mode: one useful item today, not a wall of links.
- Search/chat mode: "show me AI automation bookmarks about email" or "high-protein recipes that are easy."
- Trip mode: before Vegas/LA/Japan/etc., surface saved places grouped by food, bars, shops, attractions.
- Cluster detection: if Papi keeps saving related items, propose turning the cluster into a project plan.

## Initial categories

1. AI / Automation
   - agents, n8n, workflows, prompts, tools, coding/dev, business automation.
2. Recipes / Food
   - easy meals, high protein, date-night food, snacks, meal prep, restaurants to try.
3. Places / Travel
   - Los Angeles, Vegas, NorCal, Japan, Mexico, general bucket list.
4. Business / Reselling
   - Amazon/eBay tips, sourcing, pricing, shipping, tax/finance, credit card optimization.
5. Personal Improvement
   - ADHD systems, workouts, productivity, style/home/life upgrades.
6. Funny / Low Priority
   - worth keeping but not worth acting on.

## MVP v1 proposal

Build a Telegram capture workflow:

1. Papi sends a link plus optional note/category.
   - Example: `https://x.com/... ai automation`
   - Example: `https://tiktok.com/... recipe`
2. Pipeline stores raw link and source metadata.
3. Extractor summarizes and tags the item.
4. Data is saved to a structured store.
5. Curated Obsidian notes are generated or updated for higher-value items.
6. Bot replies with a short confirmation:
   - `Saved under AI Automation → n8n/Gmail. Next action: compare with Gemini Orders parser.`

## Later phases

### MVP v2 — Batch import

Process pasted lists or exports, such as "process these 30 links."

### MVP v3 — Automated bookmark pull

Evaluate direct X bookmark API / `xurl`, browser automation, and TikTok automation after the capture workflow proves useful.

### Agentic librarian version

Possible names:

- Bookmark Janitor
- Hell Librarian
- Mnemo Collector
- The Archivist
- Bookmark Goblin

Weekly output shape:

```text
Papi, I cleaned up 42 new bookmarks.

Highlights:
- 9 AI automation ideas
- 6 recipes
- 4 places
- 3 reseller/business tips
- 20 low-value/funny saves

Top 3 worth action:
1. Build Gmail-to-Sheets receipt classifier upgrade
2. Try chicken shawarma bowl recipe
3. Save LA rooftop bar to date-night list
```

## Build principles

- Do not start by scraping everything; start with reliable capture.
- Every saved item needs a category, summary, next action, future context, or discard reason.
- Avoid another inbox. Resurfacing is part of the product, not a bonus.
- Keep Papi's ADHD workflow in mind: fewer menus, fewer giant lists, more "one useful thing next."
- No secrets or platform credentials in chat. If X/TikTok auth is needed later, use account-local credential setup and never paste tokens.

## Next time we pick this up

Recommended next work session:

1. Create an `owner: hermes` spec for Bookmark Hell MVP v1.
2. Decide first storage substrate: SQLite + Obsidian exports, or Google Sheet + Obsidian exports.
3. Define the Telegram capture syntax and confirmation style.
4. Build a no-platform-auth pipeline first: URL in, structured record + summary out.
5. Add weekly digest only after capture/extraction is stable.
