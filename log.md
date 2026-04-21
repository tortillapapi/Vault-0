# Wiki Log

*Chronological append-only record of wiki activity. Each entry starts with*
*a line matching `^## \[` for grep-friendly parsing.*

## [2026-04-19] schema | initial schema v0.1
- WIKI_SCHEMA.md created
- Vault directory structure initialized
- Ready for first ingest

---

*Entries are appended by the Grunt tier during ingests, by CC during lint*
*and query operations, and by humans when making schema changes.*

*Quick queries:*
```bash
# Last 10 entries
grep "^## \[" log.md | tail -10

# Only ingests
grep "^## \[.*\] ingest" log.md

# Activity on a specific date
grep "^## \[2026-04-19\]" log.md
```
