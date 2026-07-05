---
type: system-project
title: Parked Backlog
slug: parked-backlog
created: 2026-06-16
last_updated: 2026-07-05
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

- **Status:** NEXT-UP — Papi confirmed 2026-07-05 (Fable sprint, spec 167) as the next
  activation once sprint wrap-up tasks land. No build starts until then.
- **Source:** `system/projects/bookmark-hell-pipeline.md`
- **Goal:** turn X/TikTok/YouTube/article bookmarks and shared links into categorized,
  searchable, resurfaced knowledge with summaries and next actions.
- **Needed next:** create an owner spec for MVP v1, choose storage
  (SQLite/Sheet plus Obsidian), define Telegram capture syntax, then build
  URL-in -> structured record + summary -> confirmation.
- **Why it matters:** Papi saves useful ideas, but they currently disappear.

### VPS Watchdog Alerts — ✅ SHIPPED 2026-07-02

- **Status:** ACTIVATED and verified (spec 164, Fable sprint): OnFailure drop-ins on 6
  critical units + daily silent-failure sweep at 04:20 UTC. Alerts proven end-to-end.
- Remove from parking on next review; kept one cycle for visibility.

### Receipt & Expense Snap

- **Status:** proposed spec
- **Source:** `/root/specs/131-receipt-expense-snap.md`
- **Goal:** photo a business receipt in Telegram and turn it into a categorized
  expense row after OCR/extraction and confirmation.
- **Needed next:** design the finance-data expense schema/confirm flow, reuse the
  Milo photo OCR pattern, and add safe correction tools.
- **Why it matters:** fills business expense/COGS gaps Plaid will not reliably capture.

### Mission Control Backlog

- **Status:** MVP live; enhancements parked
- **Source:** `system/projects/mission-control.md`
- **Goal:** improve the agent/task cockpit after the read-only MVP.
- **Needed next:** decide which enhancement is worth activating: controlled spec
  creation, dispatch controls, public access/auth hardening, office/mobile view, or
  richer full-text search.
- **Why it matters:** makes the agent fleet easier to steer and audit.

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
