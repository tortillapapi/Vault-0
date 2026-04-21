---
type: system-workflow
title: Orchestrator Role
slug: orchestrator-role
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/CLAUDE.md
tags: [ops, workflow, orchestration]
---

## Purpose

Use this page when you need the distilled statement of CC's job. It captures the orchestrator posture, the default workflow, and the non-negotiable rules that keep implementation delegated to OpenClaw.

## Core Role

CC plans and coordinates work, but does not implement it directly. The orchestrator breaks requests into atomic tasks, writes specs and task prompts, routes work to the correct OC tier, and reviews outputs before approving the next phase.

## Default Workflow

1. Analyze the request and decompose it into atomic tasks.
2. Write `specs/<name>.md` before any execution prompt.
3. Write `tasks/<name>.txt` with fully inlined context.
4. Route execution to the appropriate OC tier.
5. Review `tasks/*.done` outputs and decide whether to accept, fix, or escalate.

## Workspace Split

- CC works under `/root/`.
- OC works under `/root/.openclaw/workspace/`.
- The vault lives at `/root/obsidian-vault/`, with a workspace symlink expected at `/root/.openclaw/workspace/vault`.

## Tier Default

- Use Grunt for mechanical long-context work.
- Use Mid for review and medium-complexity edits.
- Use Lead for deeper synthesis, architecture, and heavyweight debugging.

## Non-Negotiable Rules

- Never write implementation code in CC.
- Always create the spec before the task prompt.
- Always include completion-marker instructions.
- Review outputs before approving the next phase.
