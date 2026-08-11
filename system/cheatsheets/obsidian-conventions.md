---
type: system-cheatsheet
title: Obsidian Conventions
slug: obsidian-conventions
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
canonical_for: [vault-frontmatter-and-linking-conventions]
tags: [ops, cheatsheet, obsidian, vault]
---

## Purpose

Use this page as the quick reference for naming, linking, and frontmatter rules in the vault. Consult it before writing or reviewing pages under either `wiki/` or `system/`.

## Wikilinks

- Use `[[kebab-case-slug]]` for wiki page links.
- Avoid spaces, capitals, and `.md` extensions in wiki slugs.
- Link on first mention, then avoid over-linking the same target.
- When duplicate names exist in `system/`, prefer path-qualified links such as `[[skills/task-spec-template|task-spec-template]]`.

## File Naming

- `wiki/` pages use kebab-case slugs by content type.
- `system/` mirrors preserve the source filename when possible.
- Index pages stay named `index.md` inside each subdirectory.

## Wiki Frontmatter Basics

- Entity pages use `type: entity` plus `subtype`, `title`, `slug`, created and updated dates, and `sources`.
- Concept pages use `type: concept` with title, slug, dates, and `sources`.
- Source pages record `source_type`, publication and ingest dates, and the raw source path.
- Comparison and topic pages follow the schemas in `WIKI_SCHEMA.md` and should not improvise new required fields.

## System Frontmatter Basics

- Mirrored `system/` pages record `type`, `title`, `slug`, `source_path`, `last_synced`, `maintainer`, and `tags`.
- Synthesized `system/` pages declare authority, not provenance:
  - `canonical_for: [topic, ...]` — this page IS the source of truth for those topics.
  - `canonical: <page>` — this page defers to that one; if they disagree, that one wins.
  - `sources_at_time:` — historical provenance on decision records only. **Never** an
    authority pointer.
  - `derived_from:` is **retired** (2026-08-10). Nearly every instance pointed at a file
    version that no longer existed, and several inverted authority by making the vault
    appear derived from an agent's private memory cache.
- `README.md` and directory `index.md` pages are the only `system/` pages that skip frontmatter.

## Editing Discipline

- Never edit anything under `raw/`.
- Never hand-edit mirrored `system/` pages, re-sync them from the upstream source instead.
- Keep internal ops knowledge in `system/`, and external knowledge in `wiki/`.
