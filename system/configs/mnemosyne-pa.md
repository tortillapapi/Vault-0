---
type: system-config
title: Mnemosyne PA Bot
slug: mnemosyne-pa
owner: hermes
last_updated: 2026-06-05
---

# Mnemosyne PA Bot

## Purpose
Mnemosyne (short names Mnemo/Nemo) is Papi's lightweight ADHD executive-function assistant. It is separate from Janus/Hermes default so Janus can stay focused on complex orchestration, development, and debugging.

Mnemo handles:

- quick capture,
- reminders,
- waiting-on tracking,
- daily command stack,
- overwhelm triage,
- small life-admin follow-through.

## Hermes profile

- Profile: `papipa`
- Path: `/root/.hermes/profiles/papipa`
- Model: `opencode-go/deepseek-v4-pro`
- Reasoning: medium
- Gateway service: `hermes-gateway-papipa.service`
- Telegram bot: `@RareForce_mnemosyne_bot`
- State dir: `/root/.hermes/profiles/papipa/pa-state/`

State files:

- `tasks.json`
- `reminders.json`
- `waiting_on.json`
- `daily_log.jsonl`

## Persona / SOUL

Primary file:

```text
/root/.hermes/profiles/papipa/SOUL.md
```

Key rules:

- Call user Papi.
- Keep responses short, structured, and ADHD-friendly.
- Use deterministic helper for quick-capture commands; do not improvise JSON writes.
- Work/Richemont systems are inaccessible unless Papi manually dumps context.
- Confirm before external writes such as Gmail/calendar/Drive changes.
- Escalate complex building/debugging to Janus.

## Quick-capture kernel

Spec 113 installed:

```text
/root/.hermes/profiles/papipa/pa/bin/mnemo.py
/root/.hermes/profiles/papipa/pa/README.md
```

Supported commands:

```bash
/root/.hermes/profiles/papipa/pa/bin/mnemo.py capture "ADD buy shipping tape"
/root/.hermes/profiles/papipa/pa/bin/mnemo.py capture "PARK idea: source LEGO clearance next month"
/root/.hermes/profiles/papipa/pa/bin/mnemo.py capture "WAITING ON Mike for Cartier router approval, nudge in 2 days"
/root/.hermes/profiles/papipa/pa/bin/mnemo.py capture "REMIND me to test Mnemo tomorrow at 10am"
/root/.hermes/profiles/papipa/pa/bin/mnemo.py capture "OVERWHELMED laundry orders oil change returns emails"
/root/.hermes/profiles/papipa/pa/bin/mnemo.py list
/root/.hermes/profiles/papipa/pa/bin/mnemo.py due
/root/.hermes/profiles/papipa/pa/bin/mnemo.py done <id-or-prefix>
```

Default timezone: Pacific / `America/Los_Angeles`.

Verification examples passed on 2026-06-05:

- `ADD` creates open task.
- `PARK` creates parked task.
- `WAITING ON ... nudge in 2 days` creates waiting item with nudge.
- `REMIND me to ... tomorrow at 10am` creates scheduled reminder.
- `OVERWHELMED laundry orders oil change returns emails` replies with top 3 including `oil change` and parks items.
- `due --now 2100-01-01T00:00:00-08:00` emits due reminders/nudges and updates state.

## Due reminder dispatcher

Spec 114 installed:

```text
/root/.hermes/profiles/papipa/scripts/mnemo-due-dispatch.py
```

Behavior:

- Calls `mnemo.py due`.
- Prints nothing and exits 0 when no items are due.
- Prints Telegram-ready text when due reminders/waiting nudges exist.
- Exits non-zero with stderr diagnostics on helper/JSON failures.

Hermes cron job:

- Job ID: `cbcef468213a`
- Name: `Mnemosyne Due Reminder Dispatcher`
- Profile: `papipa`
- Schedule: `every 5m`
- Delivery: `telegram`
- Mode: `no_agent` script-only
- Script: `mnemo-due-dispatch.py`

## Daily command stack

Hermes cron job:

- Job ID: `0d108b2bb0c2`
- Name: `Mnemosyne Daily Command Stack`
- Profile: `papipa`
- Schedule: `5 16 * * *` (9:05 AM Pacific during PDT)
- Delivery: `telegram`

## Maintenance notes

- Keep Mnemo state inside the `papipa` profile.
- Do not copy bot tokens into specs, logs, or docs.
- If quick-capture behavior changes, update both `SOUL.md` and this document.
- Run helper verification with a backup/restore around PA state to avoid leaving fake tasks/reminders.
