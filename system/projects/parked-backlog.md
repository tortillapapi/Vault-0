---
type: system-project
title: Parked Backlog
slug: parked-backlog
created: 2026-06-16
last_updated: 2026-06-18
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

- **Status:** parked MVP idea
- **Source:** `system/projects/bookmark-hell-pipeline.md`
- **Goal:** turn X/TikTok/YouTube/article bookmarks and shared links into categorized,
  searchable, resurfaced knowledge with summaries and next actions.
- **Needed next:** create an owner spec for MVP v1, choose storage
  (SQLite/Sheet plus Obsidian), define Telegram capture syntax, then build
  URL-in -> structured record + summary -> confirmation.
- **Why it matters:** Papi saves useful ideas, but they currently disappear.

### VPS Watchdog Alerts

- **Status:** proposed spec
- **Source:** `/root/specs/130-vps-watchdog-alerts.md`
- **Goal:** send Telegram alerts only when critical VPS automations fail or go stale.
- **Needed next:** create/install `OnFailure` alert drop-ins and a daily silent-failure
  sweep for timers, failed services, disk, backups, and stale snapshots.
- **Why it matters:** the VPS is healthy now, but failures can be silent.

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

### Orders Dashboard v2

- **Status:** low-priority parked backlog
- **Source:** `system/projects/orders-dashboard.md`
- **Goal:** improve the shipped orders dashboard only when Papi asks for it or a
  real workflow pain appears.
- **Possible next:** per-row totals override, email-thread linkback, date presets,
  CSV export, compact Notion-friendly view, token rotation, or multi-user views.
- **Why it matters:** useful polish, but v1 is stable and should not distract from
  higher-value work.

## Not parked: active or decision-bound work

These are not "someday" ideas; they need a decision or focused project continuation.

- **Spec 145 parser backfill:** Papi needs to approve or reject one verified Pokemon
  ETB append row. Todd Snyder apparel is excluded unless Papi explicitly reclassifies
  it as resale inventory.
- **Profit Engine / COGS:** sales sync and COGS seed import exist. Next real work is
  allocating COGS observations to sold items and comparing local margin output against
  Sellerboard benchmarks.
- **Order parser Spec 135 repo cleanup:** deployed parser changes appear to be on disk
  but uncommitted in `/root/n8n/local-files/order-parser`; clean this before more
  parser work stacks on top.

## Agent guidance

- Prefer activating one backlog item at a time.
- Check current specs/tasks/reviews before starting; many old markers are stale.
- If a parked item becomes active, create or update a spec and record the new owner.
