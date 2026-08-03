---
type: system-project
title: Parked Backlog
slug: parked-backlog
created: 2026-06-16
last_updated: 2026-08-01
status: parked
priority: review-weekly
tags: [project, backlog, parking-lot, agents]
---

# Parked Backlog

This is the canonical parking lot for ideas Papi has mentioned but that are not
currently active emergencies. When an agent is asked "what can be worked on next",
check this file before inventing new work.

## Review cadence

Review weekly, ideally Sunday around noon Pacific. Pick one item to activate, defer,
or delete. Do not let this become another inbox.

## Daily visibility

Mnemosyne's daily command stack surfaces a short Parked ideas section from this
file plus Mnemo `PARK <text>` captures. Use `PARK` for loose ideas that should stay
visible without becoming full specs. Activation still requires an explicit
"activate/build/spec this" style request.

## Highest-value parked items

### Bookmark Hell Pipeline

- **Status:** NEXT-UP, still not started. The 2026-07-05 gate ("once sprint wrap-up
  tasks land") was satisfied 2026-08-01, so this is now activatable on request.
- **Source:** `system/projects/bookmark-hell-pipeline.md`
- **Goal:** turn X/TikTok/YouTube/article bookmarks and shared links into categorized,
  searchable, resurfaced knowledge with summaries and next actions.
- **SCOPE STEER — Papi, 2026-08-03: no mass import.** Do not design this around
  bulk-ingesting an entire bookmark export. Several TikTok bookmark folders are
  irrelevant to this project, and a mass import would drag them in. Papi wants to
  send links from *specific chosen folders*, deliberately — a more manual,
  curated feed. Design the MVP for selective per-folder or per-link submission,
  not a one-shot backfill.
- **Needed next:** create an owner spec for MVP v1 built on the curated-submission
  model above, choose storage (SQLite/Sheet plus Obsidian), define Telegram capture
  syntax, then build URL-in -> structured record + summary -> confirmation.
- **Why it matters:** Papi saves useful ideas, but they currently disappear.

### VPS Watchdog Alerts — ✅ SHIPPED 2026-07-02

- **Status:** ACTIVATED and verified (spec 164, Fable sprint): OnFailure drop-ins on 6
  critical units + daily silent-failure sweep at 04:20 UTC. Alerts proven end-to-end.
- Remove from parking on next review; kept one cycle for visibility.

### Receipt & Expense Snap — ❌ SCRAPPED 2026-07-05

- Killed by Papi (Fable sprint, spec 167 decision A). Do not propose revival.
  Context: COGS coverage verified 100% (spec 163), weakening the original money case.

### Google Drive Organization — ✅ CLOSED 2026-07-31, DO NOT RE-PITCH

- **Status:** DONE. Spec 156 (org) and 157 (templates) both `status: complete`. The 16
  root files excluded from the Phase 1 safe batch were cleaned up by Papi by hand and
  verified against live Drive on 2026-07-31 (root = 10 folders + 3 unrelated new files).
- **There is no "Phase 2."** A stale *Recommendation* section at the bottom of
  `/root/reviews/156-google-drive-workspace-organization-execution-report.md` listed 3
  open questions about those 16 files; it was written 2026-06-30, was never updated when
  Papi handled them, and caused a later session to re-pitch finished work as backlog.
  That section is now marked RESOLVED with a closeout table.
- **Only genuinely untouched:** `Docs/` (175 unexamined children) and `Saved from Chrome/`,
  both deliberately out of scope in Phase 1. Treat as a *new* discovery effort, not a
  last-mile finish. Do not start unless Papi asks for it by name.

### Mission Control Backlog

- **Status:** MVP live; enhancements parked
- **Source:** `system/projects/mission-control.md`
- **Goal:** improve the agent/task cockpit after the read-only MVP.
- **Needed next:** decide which enhancement is worth activating: controlled spec
  creation, dispatch controls, public access/auth hardening, office/mobile view, or
  richer full-text search.
- **Why it matters:** makes the agent fleet easier to steer and audit.

### Janus Personal Telegram Workspace

- **Status:** PARKED — documented 2026-08-01; do not activate yet.
- **Source:** `system/projects/janus-personal-telegram-workspace.md` and
  `/root/context/hermes-handoff-telegram-gateway-macbook-2026-08-01.md`.
- **Goal:** create a private `Janus Personal` Telegram group using the existing
  default gateway, keeping personal-assistant context separate from the build DM
  without another always-on gateway.
- **Needed next:** Papi creates the group, adds `@RareForce_Janus_Bot`, and sends a
  test message; then Janus identifies the chat ID, adds scoped authorization/prompt
  configuration, and verifies both chats.
- **Guardrail:** no Telegram config edits before the chat ID is known; Papipa remains
  stopped/disabled and its profile/job remain preserved.

### TCG product-ID backfill — scoped 2026-08-03, not started

- **Status:** NEXT-UP for the Command Center. Papi asked for this immediately after
  the 2026-08-03 price-refresh fixes; blocked that night only because the PPT quota
  was exhausted. Nothing has been built.
- **Source:** [[inventory-command-center]]; commits `5dfb524` / `1732445`.
- **The scope is not what the headline number suggests.** 24 active items carry no
  `tcgplayer_product_id` (22 sealed + 2 singles), and they split three ways:
  - **~13 mainstream English Pokémon items** — Astral Radiance / Brilliant Stars /
    Hidden Fates / Paldea Evolved / Paradox Rift / Journey Together / Phantasmal
    Flames / Ascended Heroes / Mega Evolution (Lucario) / Sword & Shield ETBs,
    151 Booster Bundle, 151 Poster Collection, Evolving Skies ETB. Standard
    TCGplayer catalogue entries. **This is the only real backfill.**
  - **~9 Chinese-language products** — 151C Gather boxes, Chinese Gem Pack, Journey
    Path, White Future (PKC). TCGplayer does not carry Chinese-language sealed, so
    PPT can never price these no matter what ID is attached.
  - **1 One Piece card** — Watermelon Luffy x Eiichiro Oda Signature. PPT is a
    *Pokémon* price tracker; wrong vendor entirely.
- **No shortcut exists:** 0 of the 24 have a `tcgplayer_url` to parse an ID out of,
  and PriceCharting is only a display URL in the workbook (not a price source) on
  5 of 128 active items.
- **Needed next:** a dry-run-first resolver over the ~13 English items reusing
  `scripts/tcg/resolve_names.py`, run inside the rolling quota. Then mark the
  Chinese + One Piece items explicitly manual-priced so they stop consuming quota
  and stop reading as failures.
- **Decision still open:** whether the ~10 non-TCGplayer items justify standing up a
  PriceCharting price integration. That is its own project, not a backfill step.

## Not parked: active or decision-bound work

These are not "someday" ideas; they need a decision or focused project continuation.

- ~~Spec 145 parser backfill ETB decision~~ — RESOLVED: appended 2026-06-18 by spec 147
  (verified in account_b + master); this entry was stale. Todd Snyder stays excluded.
- **Profit Engine:** evergreen-active, no upgrade queued. eBay finance events complete
  (spec 162); COGS coverage verified 100% — 1576/1576 sales costed (spec 163, 2026-07-05).
  The parser-linkage "review queue" is provenance-only noise, pending removal from
  operator-close packages (Hermes handoff, spec 167 decision 1).
- ~~Order parser Spec 135 repo cleanup~~ — RESOLVED: spec 166 committed all deployed
  drift (`2126a0c`, 2026-07-05); repo clean, 12/12 fixtures pass. No git remote yet
  (spec 167 decision 3).

## Agent guidance

- Prefer activating one backlog item at a time.
- Check current specs/tasks/reviews before starting; many old markers are stale.
- If a parked item becomes active, create or update a spec and record the new owner.
