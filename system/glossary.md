---
type: system-glossary
title: System Glossary
slug: glossary
last_updated: 2026-08-10
maintainer: cc-oc-orchestrator
canonical: system/workflows/peer-orchestrator-protocol
tags: [ops, glossary, system]
priority: reference
domain_tags: [wiki-ops, oc-system]
last_accessed: 2026-04-22
access_count: 0
---

## Purpose

Shared vocabulary for CC and OC. Use this page when a term appears in a spec, task, review, or routing note and you need the local meaning, not the generic one.

## Terms

- **CC** — Claude Code. Plain by default (does the work directly); orchestrates only on request. Reached over Telegram as **Metis**, which is a surface of CC, not a separate peer.
- **OC** — OpenClaw, the execution runtime and agent system that performs delegated work; used in skills, workflows, and agent dispatch docs.
- **orchestrator** — The coordinating role that decomposes work, routes it to tiers, and reviews outcomes. **Hermes/Janus is the primary orchestrator**; CC and Codex do it only when asked. See [[system/workflows/peer-orchestrator-protocol]].
- **Janus** — The Hermes default profile: primary orchestrator, and since 2026-08-10 also the PA (Mnemosyne retired).
- **spec** — The authoritative task contract under `/root/specs/` that defines scope, constraints, and success criteria; used in every multi-step CC workflow.
- **task** — The execution prompt or unit of work under `/root/tasks/`, usually paired with a spec and a completion marker; used in the orchestration loop and decision logs.
- **.done** — The canonical completion marker written after a task succeeds, usually with status, timestamp, changed files, and issues; used in reviews and decision logs.
- **.blocked** — The marker written when a task cannot proceed without help, including the concrete blocker and partial work; used for safe failure handling.
- **grunt** — The low-tier execution lane, currently optimized for mechanical long-context work and document transforms; used in tier-routing, decision logs, and dispatch references.
- **mid** — The **default** GPT lane (`openai/gpt-5.6-luna`, xhigh): judgment-heavy work, review, synthesis. First escalation from grunt tier.
- **lead** — The **explicit-only** escalation lane (`openai/gpt-5.6-sol`, xhigh). Reserved for exceptionally hard tasks or when grunt/re-review/mid are stuck; never routine or scheduled work. See [[system/configs/openclaw-agents]].
- **main** — **Retired.** No longer a configured OpenClaw lane; `mid` is the default. Historical docs and session keys may still reference it; ignore those routings.
- **tier** — A routing category that groups agents by complexity and intended task type; used in specs, workflows, and decision summaries.
- **session key** — The human-readable phrase for the persistent OC session identifier, usually shaped like `agent:<id>:main`; used in routing docs and task specs.
- **sessionKey** — The exact field name or config label used when a tool or doc refers to the session key programmatically; used in specs and agent dispatch references.
- **vault** — The Obsidian knowledge base rooted at `/root/obsidian-vault`; used in WIKI_SCHEMA and all wiki/system writing tasks.
- **wiki** — The external-knowledge tree under `vault/wiki/`, used for sources, entities, concepts, topics, and comparisons; used in WIKI_SCHEMA and wiki skills.
- **system tree** — The internal-ops tree under `vault/system/`, used for mirrored skills, workflows, templates, configs, cheatsheets, glossary, and decisions; defined by Spec 20 and WIKI_SCHEMA v0.2.
- **wikilink** — An Obsidian-style `[[target]]` link, optionally path-qualified or aliased, used throughout the vault for navigation; defined in WIKI_SCHEMA and summarized in `obsidian-conventions`.
