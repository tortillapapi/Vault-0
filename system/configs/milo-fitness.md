---
type: system-config
title: Milo Fitness Bot
slug: milo-fitness
owner: hermes
created: 2026-06-10
last_updated: 2026-07-14
derived_from:
  - /root/.hermes/profiles/milo/SOUL.md
  - /root/.hermes/profiles/milo/profile.yaml
  - /root/.hermes/profiles/milo/workout/milo_workout.py
  - /root/.hermes/profiles/milo/skills/milo/milo-nutrition/SKILL.md
tags: [ops, config, hermes, milo, fitness, workout, nutrition]
---

# Milo Fitness Bot

## Purpose

Milo is Papi's Telegram fitness assistant in Hermes. It handles real-time
workout logging plus food, calorie, and macro tracking. Conversational replies
stay short and gym-readable, while all state changes go through deterministic
local Python kernels rather than model-authored file or Sheet edits.

## Hermes Profile

- Profile: `milo`
- Path: `/root/.hermes/profiles/milo`
- Persona/routing rules: `/root/.hermes/profiles/milo/SOUL.md`
- Profile metadata: `/root/.hermes/profiles/milo/profile.yaml`
- Gateway service: `hermes-gateway-milo.service`
- Google account home: `/root/.hermes/google-accounts/mramirez021111`
- Google Sheet: `Workout Tracker`
- Sheet ID: `1jD5IR66GmZwwNLSZgG4fdc_5G7oKJsb-TzS9nrrBfTY`

Service checks:

```bash
systemctl --user status hermes-gateway-milo
journalctl --user -u hermes-gateway-milo -f
```

After changing Milo's `SOUL.md` or runtime code:

```bash
systemctl --user restart hermes-gateway-milo
```

## Routing

Milo routes clear state-changing intents to the matching kernel:

- food, calories, macros, meals, diet, labels -> nutrition kernel
- exercises, weights, reps, sets, workout commands -> workout kernel
- ordinary encouragement/advice -> normal conversation

The model must return the kernel's result and must not improvise state changes.

## Workout Kernel

Primary code and state:

```text
/root/.hermes/profiles/milo/workout/milo_workout.py
/root/.hermes/profiles/milo/workout/state.json
/root/.hermes/profiles/milo/workout/history.jsonl
/root/.hermes/profiles/milo/workout/exercise_aliases.json
```

The local JSONL history is the write-ahead fallback. Google Sheets is the
durable reporting backend.

Supported operations include:

- start, finish, or cancel a workout session
- log one or multiple sets
- use current-exercise shortcuts such as `+ 190x6`, `same`, and `same +5`
- show a current-session summary
- show recent performance for an exercise
- undo the most recent set

### Workout Data Model

Session IDs remain the durable grouping key. Workout names are labels and may
repeat across different dates.

Every session and set carries:

- `workout_date`: Pacific calendar date (`YYYY-MM-DD`)
- UTC ISO timestamp: audit/debugging timestamp
- `session_id`: unique grouping key
- `session_name`: human-readable workout label

The date is derived from the session start in `America/Los_Angeles`. A workout
that crosses midnight remains attached to the date on which that session
started.

### Sheet Tabs

`Sets` columns:

```text
event_id, timestamp, session_id, session_name, exercise, set_number,
weight, reps, unit, rpe, note, source_text, status, workout_date
```

`Workout Sessions` columns:

```text
session_id, session_name, started, ended, status, total_sets,
total_volume, notes, workout_date
```

The spreadsheet itself remains configured as GMT because it also contains
nutrition data. Milo writes an explicit Pacific `workout_date` instead of
depending on spreadsheet timezone conversion.

### June 10, 2026 Date Migration

The workout log originally had UTC timestamps and session IDs but no
first-class local calendar date. On June 10, 2026:

- added `workout_date` to workout session/set state and Sheet rows;
- backfilled all 12 existing `Sets` rows to `2026-06-07`;
- backfilled all 13 local workout history records to `2026-06-07`;
- added the date to the existing open session state;
- changed recent-exercise output to show the Pacific date;
- grouped history by `session_id`, preventing same-named workouts from merging;
- changed workout summaries to display the session date;
- retained UTC timestamps for audit/debugging.

The existing June 7 session was intentionally left open because its true
completion status was not known.

Verification:

- workout self-test: `34/34` passed;
- Pyright: `0` errors and `0` warnings;
- Sheet date backfill: idempotent, `0` rows remaining without a date;
- live `last bench` and `summary` output displayed `2026-06-07`;
- `hermes-gateway-milo.service` restarted and returned active/running.

Rollback artifacts:

```text
/root/.hermes/profiles/milo/workout/milo_workout.py.bak-2026-06-10-pacific-dates
/root/.hermes/profiles/milo/SOUL.md.bak-2026-06-10-pacific-dates
/root/.hermes/profiles/milo/workout/history.jsonl.bak-2026-06-10-pacific-dates
/root/.hermes/profiles/milo/workout/state.json.bak-2026-06-10-pacific-dates
/root/.hermes/profiles/milo/workout/sheet-backup-20260610-pacific-dates.json
```

## Nutrition Kernel

Primary code and state:

```text
/root/.hermes/profiles/milo/nutrition/milo_nutrition.py
/root/.hermes/profiles/milo/nutrition/history.jsonl
/root/.hermes/profiles/milo/nutrition/saved_foods.json
```

The nutrition kernel supports food logging, daily totals, undo, saved meals,
saved foods, and nutrition-label text/JSON ingestion. Nutrition label photo
handling was activated under Specs 118-119 on June 6, 2026.
On July 14, 2026, Milo's auxiliary vision backend was set explicitly to
Anthropic `claude-sonnet-4.6` after Telegram photo pre-analysis failed with
`No LLM provider configured for task=vision provider=auto`. The main chat model
remains `opencode-go/deepseek-v4-pro`; only image extraction uses the vision
backend.

Visual nutrition flow:

- package nutrition labels -> extract exact visible label fields and pass them
  to `label-json` with `source=label_photo`;
- restaurant menus/menu boards/receipts -> extract visible item names,
  descriptions, ingredients, portion clues, prices, and printed calories/macros;
- menu images with printed calories/macros -> pass exact visible values through
  `label-json` with `source=user_provided`;
- menu images with only descriptions/ingredients -> build a labeled menu
  estimate via `label-json` with `source=web_estimate`, preview first, and log
  only after Papi confirms item, serving, meal type, date, and macros.

Hard rules:

- never invent macros for unknown or ambiguous foods;
- preserve brand, product, serving, source, and confidence metadata;
- only write high-confidence label results with explicit log/save intent;
- use `America/Los_Angeles` for `meal_date`;
- keep test mutations isolated from live local state and the live Sheet.

The nutrition skill/runbook is:

```text
/root/.hermes/profiles/milo/skills/milo/milo-nutrition/SKILL.md
```

## Testing and Maintenance

Workout verification:

```bash
python3 -m py_compile /root/.hermes/profiles/milo/workout/milo_workout.py
python3 /root/.hermes/profiles/milo/workout/milo_workout.py --self-test
/root/.hermes/profiles/milo/lsp/node_modules/.bin/pyright \
  /root/.hermes/profiles/milo/workout/milo_workout.py
```

Self-tests must set `MILO_DISABLE_SHEET=1` and use a temporary
`MILO_WORKOUT_HOME` or `MILO_NUTRITION_HOME`. Never run mutation smoke tests
against live local state. Live Sheet tests must use obvious `TEST` rows and
clean them immediately.

Vision verification:

```bash
python3 -m py_compile /root/.hermes/profiles/milo/nutrition/milo_nutrition.py
MILO_DISABLE_SHEET=1 MILO_NUTRITION_HOME=$(mktemp -d) \
  python3 /root/.hermes/profiles/milo/nutrition/milo_nutrition.py --self-test
hermes --profile milo -z 'Use vision_analyze on ...' \
  --provider anthropic --model claude-sonnet-4.6 -t vision
systemctl --user restart hermes-gateway-milo
systemctl --user status hermes-gateway-milo
```

July 14 verification: nutrition self-test `61/61` passed; Anthropic
`vision_analyze` could read the cached menu image at
`/root/.hermes/profiles/milo/cache/images/img_f77ef2e18e14.jpg`; gateway restart
returned active/running.

## Change Documentation Rule

When Milo behavior, schema, routing, timezone handling, service configuration,
or deterministic kernels change:

1. update the relevant live profile/code;
2. run isolated tests and verify the gateway;
3. update this page;
4. add an append-only entry to `log.md`;
5. commit and push the Vault.
