# System Tree

`system/` holds the internal operating manual for CC and OC. It mirrors selected files from `/root/` and adds synthesized workflow pages so the operating context is readable inside the vault without mixing it into the external-knowledge wiki.

## Discipline

- Treat mirrored pages as read-only reflections of upstream files.
- Re-sync mirrored pages by task, do not hand-edit them in place.
- Keep secrets, credentials, config JSON, backups, and `vault/wiki/` content out of this tree.
- Use `last_synced` and `source_path` to track upstream freshness.

## Frontmatter

Mirrored and synthesized pages under `system/` use the system frontmatter schema documented in `WIKI_SCHEMA.md`. Mirrored pages record `source_path` and `last_synced`; synthesized pages record `derived_from` instead.

## Navigation

Start with [[system/index]] for the catalog, then drill into [[skills/index|skills index]], [[workflows/index|workflows index]], [[templates/index|templates index]], [[cheatsheets/index|cheatsheets index]], [[configs/index|configs index]], [[decisions/index|decisions index]], or [[glossary]].
