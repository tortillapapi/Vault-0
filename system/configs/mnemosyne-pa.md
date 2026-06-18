---
type: system-config
title: Mnemosyne PA Bot
slug: mnemosyne-pa
owner: hermes
last_updated: 2026-06-18
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

The profile config also sets:

```yaml
timezone: America/Los_Angeles
session_reset:
  mode: daily
  at_hour: 4
```

Daily reset prevents a long-lived PA session from treating its original
conversation-start date as the current date.

Verification examples passed on 2026-06-05:

- `ADD` creates open task.
- `PARK` creates parked task.
- `WAITING ON ... nudge in 2 days` creates waiting item with nudge.
- `REMIND me to ... tomorrow at 10am` creates scheduled reminder.
- `OVERWHELMED laundry orders oil change returns emails` replies with top 3 including `oil change` and parks items.
- `due --now 2100-01-01T00:00:00-08:00` emits due reminders/nudges and updates state.

### Reminder write path

As of 2026-06-10, all reminder wording goes through `mnemo.py`, including
natural requests such as:

```bash
mnemo.py capture "Set a reminder for me to finish Walmart setup tonight around 8:30 p.m."
```

The helper:

- resolves relative dates in `America/Los_Angeles`,
- rejects timestamps that are already in the past,
- writes the local reminder consumed by the due dispatcher,
- creates the matching Google Task in `mramirez021111` / `My Tasks`,
- stores the Pacific calendar date as the Google Task due date,
- stores the exact reminder date/time/timezone in Google Task notes.

Google Tasks due values are date-only. Use `YYYY-MM-DDT00:00:00.000Z` for the
intended Pacific calendar date; do not try to encode the reminder time in
Google Tasks' `due` field.

Mnemo must not use the `cronjob` tool or ad-hoc Google API snippets for user
reminders.

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

## Google Accounts & Data Sources

Mnemo reads personal data from two Google accounts via account-scoped OAuth tokens:

- `/root/.hermes/google-accounts/mramirez021111`
- `/root/.hermes/google-accounts/themetalman13`

Each token must include the `tasks.readonly` OAuth scope for Google Tasks
visibility. The `mramirez021111` token additionally needs the full
`https://www.googleapis.com/auth/tasks` scope for reminder mirroring.

### Current scope status

As of 2026-06-10:

- `mramirez021111` includes `https://www.googleapis.com/auth/tasks` and passed
  live read/write verification.
- `themetalman13` includes `https://www.googleapis.com/auth/tasks.readonly` for
  daily-stack visibility.

### If Tasks data is unavailable

If the daily command stack shows "Google Tasks unavailable" or the API returns 403:

1. Run the Hermes Google Workspace setup for each account to re-authenticate with the updated scope list.
2. The scope `https://www.googleapis.com/auth/tasks.readonly` is now included in `SCOPES` in both:
   - `/root/.hermes/skills/productivity/google-workspace/scripts/setup.py`
   - `/root/.hermes/skills/productivity/google-workspace/scripts/google_api.py`
3. Re-auth flow: `setup.py --auth-url` → user authorizes in browser → `setup.py --auth-code CODE`.

## Daily command stack

Hermes cron job:

- Job ID: `0d108b2bb0c2`
- Name: `Mnemosyne Daily Command Stack`
- Profile: `papipa`
- Schedule: `5 16 * * *` (9:05 AM Pacific during PDT)
- Delivery: `telegram`
- Data sources: Google Calendar, Google Tasks (read-only), parser-run-status, PA state files

### Parked ideas in the command stack

Loose ideas should use Mnemo's deterministic `PARK <text>` quick-capture command
instead of forcing a full spec. Parked captures are written to
`/root/.hermes/profiles/papipa/pa-state/tasks.json` with `status: parked`.

The daily command stack now includes a short **Parked ideas** section that reads:

- PA `tasks.json` entries where `status == "parked"`;
- `/root/obsidian-vault/system/projects/parked-backlog.md` for the canonical
  shared-agent parking lot.

Parked ideas are visibility-only. Mnemo should not activate, dispatch, or write a
spec for one unless Papi explicitly says to activate/build/spec it.

### Google Tasks data gathering

The prompt instructs Mnemo to:
1. Run `tasks lists` to discover task lists for each account.
2. Run `tasks list --list <id> --due-max <48h-iso>` for each list to find items due today, overdue, or upcoming.
3. If Tasks API returns 403/insufficient-scope, say "Google Tasks unavailable — re-auth needed" and continue.

## Maintenance notes

- Keep Mnemo state inside the `papipa` profile.
- Do not copy bot tokens into specs, logs, or docs.
- If quick-capture behavior changes, update both `SOUL.md` and this document.
- Run helper verification with a backup/restore around PA state to avoid leaving fake tasks/reminders.

## 2026-06-10 reminder-date incident

A Walmart seller-account reminder requested on Wednesday, June 10 at 8:30 PM
Pacific was initially written to a stale June 8 cron schedule and a June 9
Google Task.

Root cause:

- the Telegram session began June 4 and its cached system prompt still said
  `Conversation started: Thursday, June 04, 2026`,
- the profile timezone was blank and fell back to the VPS UTC timezone,
- the model bypassed `mnemo.py`, did not run a live date check, and improvised
  separate cron and Google Tasks payloads,
- Hermes accepted the stale one-shot cron with `next_run_at: null`.

Correction:

- the live cron was moved to `2026-06-10T20:30:00-07:00`,
- the Google Task due date was changed to `2026-06-10`,
- its notes now say `Wednesday, June 10, 2026 at 8:30 PM PT`,
- the PA session was reset after the timezone and daily-reset config changed.
