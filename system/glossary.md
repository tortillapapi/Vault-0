---
type: system-glossary
title: System Glossary
slug: glossary
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/CLAUDE.md
  - /root/specs/20-vault-system-tree.md
  - /root/.claude/projects/-root/memory/reference_agent_dispatch.md
  - /root/obsidian-vault/WIKI_SCHEMA.md
tags: [ops, glossary, system]
---

## Purpose

Shared vocabulary for CC and OC. Use this page when a term appears in a spec, task, review, or routing note and you need the local meaning, not the generic one.

## Terms

- **CC** — Claude Code, the orchestrator layer that plans work and writes specs, tasks, and reviews; used throughout `/root/CLAUDE.md` and the `system/workflows/` pages.
- **OC** — OpenClaw, the execution runtime and agent system that performs delegated work; used in skills, workflows, and agent dispatch docs.
- **orchestrator** — The coordinating role that decomposes work, routes it to tiers, and reviews outcomes instead of implementing directly; used in `orchestrator-role` and `wiki-operations`.
- **spec** — The authoritative task contract under `/root/specs/` that defines scope, constraints, and success criteria; used in every multi-step CC workflow.
- **task** — The execution prompt or unit of work under `/root/tasks/`, usually paired with a spec and a completion marker; used in the orchestration loop and decision logs.
- **.done** — The canonical completion marker written after a task succeeds, usually with status, timestamp, changed files, and issues; used in reviews and decision logs.
- **.blocked** — The marker written when a task cannot proceed without help, including the concrete blocker and partial work; used for safe failure handling.
- **grunt** — The low-tier execution lane, currently optimized for mechanical long-context work and document transforms; used in tier-routing, decision logs, and dispatch references.
- **mid** — The middle tier for reviews, medium edits, and wiring work; used in tier-routing and the wiki review loop.
- **lead** — The high-tier reasoning lane for architecture, synthesis, and harder debugging; used in agent routing and tier formation notes.
- **main** — The OC main agent/session context, distinct from the dedicated `grunt` profile even when older docs blurred them; used in session keys, dispatch examples, and CLAUDE guidance.
- **tier** — A routing category that groups agents by complexity and intended task type; used in specs, workflows, and decision summaries.
- **session key** — The human-readable phrase for the persistent OC session identifier, usually shaped like `agent:<id>:main`; used in routing docs and task specs.
- **sessionKey** — The exact field name or config label used when a tool or doc refers to the session key programmatically; used in specs and agent dispatch references.
- **vault** — The Obsidian knowledge base rooted at `/root/obsidian-vault`; used in WIKI_SCHEMA and all wiki/system writing tasks.
- **wiki** — The external-knowledge tree under `vault/wiki/`, used for sources, entities, concepts, topics, and comparisons; used in WIKI_SCHEMA and wiki skills.
- **system tree** — The internal-ops tree under `vault/system/`, used for mirrored skills, workflows, templates, configs, cheatsheets, glossary, and decisions; defined by Spec 20 and WIKI_SCHEMA v0.2.
- **wikilink** — An Obsidian-style `[[target]]` link, optionally path-qualified or aliased, used throughout the vault for navigation; defined in WIKI_SCHEMA and summarized in `obsidian-conventions`.
