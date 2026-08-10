---
type: system-workflow
title: Orchestrator Role (retired)
slug: orchestrator-role
status: retired
retired: 2026-08-10
canonical: system/workflows/peer-orchestrator-protocol
tags: [ops, workflow, retired]
---

# Orchestrator Role — retired 2026-08-10

This page described a doctrine that no longer holds: that CC is an orchestrator by
default, "never writes implementation code", and routes deeper work to `lead` as a
matter of course.

All three claims are now false:

- CC is **plain Claude Code by default** and does the work directly
  (`/root/CLAUDE.md`). Orchestrator mode is opt-in — just ask for it.
- Hermes is the primary orchestrator (`/root/.hermes.md`).
- `lead` is an **explicit-only** escalation lane, never a routine destination
  ([[system/configs/openclaw-agents]]).

The page claimed `derived_from: /root/CLAUDE.md`, but the version it was derived from
has not existed since well before 2026-07-31. It was still listed in `core-index.md`
under "always-load pages", which put retired doctrine two hops from every CC session —
the reason it is now a tombstone rather than a deletion.

**Where its content went:**

- Shared conventions → [[system/workflows/peer-orchestrator-protocol]]
- Tier routing → [[system/configs/openclaw-agents]]
- Opt-in CC/Codex orchestrator workflow → `/root/ORCHESTRATOR.md`
- Session resume → [[system/workflows/session-resume-protocol]]
