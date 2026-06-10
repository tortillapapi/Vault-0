# Bookmark Hell Pipeline

Status: parked for later build
Owner/orchestrator: Hermes/Janus
Captured: 2026-06-10T20:03:15Z

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
