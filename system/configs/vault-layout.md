---
type: system-config
title: Vault Layout
slug: vault-layout
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/obsidian-vault/WIKI_SCHEMA.md
tags: [ops, config, vault]
---

## Purpose

Use this page as the fast orientation guide to the vault. It explains which tree owns which kind of information, and where new work should be written.

## Top-Level Layout

- `WIKI_SCHEMA.md` defines the wiki and system-tree rules.
- `index.md` is the human-facing catalog for the wiki, with a pointer into the system tree.
- `log.md` is the append-only operational record.
- `raw/` holds immutable source material.
- `wiki/` holds external knowledge pages maintained by the LLM tiers.
- `system/` holds internal ops memory, mirrored docs, workflows, templates, configs, and decision logs.

## Where To Write What

- Put source ingests, entities, concepts, topics, and comparisons under `wiki/`.
- Put mirrored operating docs, process guides, templates, and internal decision summaries under `system/`.
- Never edit files under `raw/`.
- Never hand-edit mirrored `system/` pages; re-sync them from the source file.

## Wiki Subtrees

- `wiki/entities/` for people, companies, products, and places.
- `wiki/concepts/` for ideas, frameworks, and theories.
- `wiki/topics/` for rolling syntheses.
- `wiki/sources/` for one page per ingested source.
- `wiki/comparisons/` for structured comparisons.

## System Subtrees

- `system/skills/` for mirrored CC skill docs.
- `system/workflows/` for synthesized operating procedures.
- `system/templates/` for reusable spec, review, and marker formats.
- `system/cheatsheets/` for quick references.
- `system/configs/` for runtime and layout summaries.
- `system/decisions/` for grouped decision logs derived from specs and task outputs.
