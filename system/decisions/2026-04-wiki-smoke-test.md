---
type: system-decision
title: April 2026 Wiki Smoke Test Decisions
slug: 2026-04-wiki-smoke-test
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/specs/add-gitignore.md
  - /root/specs/ingest-test-source.md
  - /root/specs/close-out-smoke-test-log.md
  - /root/tasks/add-gitignore.done
  - /root/tasks/archive/smoke-test-2026-04-21/ingest-test-source-grunt.done
  - /root/tasks/archive/smoke-test-2026-04-21/ingest-test-source-review.done
  - /root/tasks/close-out-smoke-test-log.done
  - /root/reviews/ingest-test-source-signoff.md
dates: 2026-04-21 to 2026-04-21
tags: [ops, decisions, wiki, smoke-test]
priority: archive
domain_tags: [wiki-ops]
last_accessed: 2026-04-22
access_count: 0
---

## Context

Before trusting the wiki pipeline on real sources, the project needed a full dry run across vault hygiene, Grunt execution, Mid review, and CC sign-off. The smoke test used a throwaway source so the team could validate schemas, symlink behavior, append-only logging, and tier handoffs without risking real knowledge pages.

## Decisions

1. Add a dedicated `.gitignore` to the Obsidian vault through the workspace symlink so client-state noise stays out of git.
2. Use a tiny fixture source and create only the four explicitly requested pages, leaving water as source-only context instead of promoting it into an extra concept page.
3. Route the ingest through the full CC → Grunt → Mid → CC loop rather than treating it as a simple one-tier write.
4. Preserve append-only log discipline by adding a separate close-out entry after review acceptance instead of rewriting the original ingest entry.

## Outcome

The smoke test passed and validated the end-to-end orchestration loop. The only real rough edges were procedural: the initial `.gitignore` task produced a false `.blocked` because the working tree was already dirty, and the ingest task's Grunt completion marker ended up archived rather than living at the top level. Neither issue blocked sign-off, and the final review accepted the ingest cleanly.

## Artifacts

- [[#add-gitignore|add-gitignore]]
- [[#ingest-test-source|ingest-test-source]]
- [[#close-out-smoke-test-log|close-out-smoke-test-log]]
- [[#cc-sign-off|cc-sign-off]]

### add-gitignore
- Spec: /root/specs/add-gitignore.md
- Done: /root/tasks/add-gitignore.done

### ingest-test-source
- Spec: /root/specs/ingest-test-source.md
- Grunt done: /root/tasks/archive/smoke-test-2026-04-21/ingest-test-source-grunt.done
- Review done: /root/tasks/archive/smoke-test-2026-04-21/ingest-test-source-review.done

### close-out-smoke-test-log
- Spec: /root/specs/close-out-smoke-test-log.md
- Done: /root/tasks/close-out-smoke-test-log.done

### cc-sign-off
- Sign-off: /root/reviews/ingest-test-source-signoff.md
