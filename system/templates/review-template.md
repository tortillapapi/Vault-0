---
type: system-template
title: Review Template
slug: review-template
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/tasks/archive/smoke-test-2026-04-21/ingest-test-source.review
  - /root/tasks/archive/smoke-test-2026-04-21/ingest-test-source-review.done
  - /root/reviews/ingest-test-source-signoff.md
tags: [ops, template, review]
---

## Purpose

Use this template for Mid-tier review outputs and their companion `.done` markers. It preserves a consistent review surface for CC sign-off and follow-up fix routing.

## Review Report Template

```text
=====================================
WIKI REVIEW REPORT
=====================================
Task: <task-name>
Reviewer: agent:mid (GPT 5.3 Codex)
Reviewed: <ISO timestamp>
Grunt completion: <path to grunt done marker>

OVERALL_STATUS: PASS | FAIL | PARTIAL

=== FORMAT_CHECKS ===
frontmatter: PASS | FAIL (<count> files with issues)
wikilinks: PASS | FAIL (<count> broken links)
template_sections: PASS | FAIL (<count> files with structural issues)
placeholder_leftovers: PASS | FAIL (<count> files with unresolved TODOs)

=== CONSISTENCY_CHECKS ===
cross_references: PASS | PARTIAL | FAIL
  <details>
intra_batch_contradictions: PASS | FAIL
  <details>

=== COMPLETENESS_CHECKS ===
spec_pages_updated: <actual>/<expected> (missing: <list or "none">)
index_updated: PASS | FAIL
log_updated: PASS | FAIL
done_marker_format: PASS | FAIL

=== ISSUES ===
<numbered list or "none">

=== RECOMMENDATION ===
ACCEPT | FIX_TASK_GRUNT | FIX_TASK_LEAD | SCHEMA_ATTENTION

=====================================
```

## Companion Review Done Marker

```text
STATUS: COMPLETE
TIMESTAMP: <ISO 8601 UTC>
REVIEW_PATH: <absolute path to review report>
RECOMMENDATION: ACCEPT | FIX_TASK_GRUNT | FIX_TASK_LEAD | SCHEMA_ATTENTION
```

## Sign-off Pattern

After Mid completes the review, CC writes a separate sign-off note that records the basis for acceptance, any loose ends, and the final outcome.
