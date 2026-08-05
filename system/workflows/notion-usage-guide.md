---
type: workflow
title: Notion Usage Guide
slug: notion-usage-guide
created: 2026-08-05
last_updated: 2026-08-05
owner: cc
tags: [workflow, notion, para, adhd, navigation]
---

# Notion Usage Guide

Vault copy of the **📖 How To Play** page in Notion
(`3b32508b-7644-81e9-a321-ee9126e15f2f`). Notion is the canonical copy — it is
where Papi actually reads it. This copy exists so agents can answer "how is the
workspace meant to be used?" without an API call, and so the guidance is
version-controlled alongside [[notion-sync-protocol]].

## The one rule

**Open START SCREEN. Do the top thing in ▶ CONTINUE.** Everything else is
optional depth. The layout exists to make that single action possible without
deliberation.

## Navigation logic

Four screens, nothing more than two clicks deep:

| Screen | Purpose | Opened when |
|---|---|---|
| ▶️ START SCREEN | Next actions, quests, systems, inbox | Daily — the front door |
| 📡 VPS Command Center | Timers, agents, spec board, latest log | Something broke, or checking the box |
| 📚 Vault Library | Every VPS doc, searchable | Looking for something previously written |
| 🕹️ Database Hub | Raw database access | Rarely — bulk edits, building views |

The `[ INSERT COIN ]` bar on START SCREEN reaches all four plus Inbox, Areas,
Resources, Archive and the guide. It is deliberately identical on every visit —
muscle memory rather than navigation.

## The loop

- **Morning** — SYSTEMS (red sorts first) → DAILY BRIEF → top of ▶ CONTINUE
- **During the day** — everything goes in the Inbox, uncategorized
- **Weekly, ~15 min** — empty Inbox, scan for 🔴/🟡, confirm each running project
  still has a sensible Next Action, demote untouched projects to On Hold

## Capture rule

**Never sort at capture time.** Deciding where something goes is a separate and
harder job than writing it down; pairing them is what stops things being written
down at all. Four doors — Inbox, Scratchpad, Notion mobile, Google Tasks — all
land in the same place, and Inbox items also reach `system/projects/inbox.md`.

## Ownership model

This is the part that matters for agents editing things:

| Data | Owner | Editable in Notion? |
|---|---|---|
| Projects, `Sync Source = VPS` | sync (30 min) | No — edit the vault file |
| Projects, `Sync Source = Manual` | Papi | Yes, permanently opted out of sync |
| Specs / Systems / Vault Library | sync | Read-only in practice |
| Areas, Resources, Notes, Tasks | Papi | Fully his |

`▶ CONTINUE` renders the `next_action:` frontmatter line of each project doc.
An empty CONTINUE means no project has one — not a fault. See
[[notion-sync-protocol]] for the full contract.

## Troubleshooting shorthand

| Symptom | Meaning |
|---|---|
| ▶ CONTINUE empty | No `next_action:` set anywhere |
| `Last Activity` days old | **The sync stopped — canary for the whole system** |
| SYSTEMS shows 🔴 | A real timer failed; detail line is on VPS Command Center |
| DAILY BRIEF stale | Normal; refreshes at most every 6h by design |
| A Notion edit reverted | It was a `Sync Source = VPS` row |

```bash
systemctl status notion-sync.timer
journalctl -u notion-sync -n 40
```
