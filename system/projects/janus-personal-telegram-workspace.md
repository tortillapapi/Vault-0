---
type: system-project
title: Janus Personal Telegram Workspace
slug: janus-personal-telegram-workspace
created: 2026-08-01
last_updated: 2026-08-01
status: parked
priority: later
owner: hermes
next_action: ""
tags: [project, hermes, telegram, janus, personal-assistant, gateway]
---

# Janus Personal Telegram Workspace

## Status

**PARKED — documented for later activation.** This is not an active build right now.

The project is the planned personal-assistant workspace for Papi, separated from the
existing Janus build/infrastructure conversation without keeping a second gateway
running.

## Canonical handoff

`/root/context/hermes-handoff-telegram-gateway-macbook-2026-08-01.md`

## Current verified state

- The default Hermes gateway is active and remains the preferred Telegram gateway.
- The default bot is `@RareForce_Janus_Bot`.
- The Papipa gateway is inactive and disabled; its profile, history, configuration,
  Telegram token, and recurring job are preserved.
- No personal Telegram group has been created yet.
- No default Telegram configuration has been changed for this project.
- This project does not require copying credentials, OAuth stores, API keys, `.env`
  files, or private agent state to a desktop device.

## Intended design

Create a private Telegram group containing Papi and `@RareForce_Janus_Bot`, probably
named `Janus Personal`. The group gets its own Telegram chat ID and therefore a
separate Hermes conversation/session history, while the existing Janus DM remains the
build/infrastructure chat.

Preferred scoped prompt:

> This is Papi's personal-assistant workspace. Focus on organization, reminders, life
> admin, follow-through, and concise action planning. Do not assume build or
> infrastructure context unless explicitly provided. Keep personal tasks separate
> from coding work.

Telegram private topics are a possible later alternative, but the default bot must
first have Threads Settings enabled in BotFather. The group approach is the less
disruptive first implementation.

## Activation checklist

1. Papi creates the private `Janus Personal` group, adds the bot, and sends a test
   message.
2. Identify the new Telegram chat ID from the live gateway/Telegram state.
3. Add the group to the active authorization/allowlist if required.
4. Add the chat-scoped `channel_prompts` entry.
5. Restart only the default Hermes gateway if configuration changes require it.
6. Verify the personal group uses a separate session and the existing build chat still
   works.

## Boundaries

- Do not edit the default Telegram configuration before the new chat ID is known.
- Do not restart or re-enable the Papipa gateway as part of this project.
- Do not delete the Papipa profile or its dormant recurring job without explicit
  confirmation.
- Treat the group as conversation/context separation, not a hard security boundary:
  the default profile's tools, credentials, skills, and general memory remain shared.

## Next activation decision

When Papi wants to activate this project, the smallest next action is: create the
private group, add `@RareForce_Janus_Bot`, and send one test message. Then Janus can
wire and verify the chat-scoped configuration.
