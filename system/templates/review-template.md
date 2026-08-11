---
type: system-template
title: Review Template
slug: review-template
canonical: system/workflows/peer-orchestrator-protocol
last_updated: 2026-08-10
maintainer: cc
tags: [ops, template, review]
---

# Review Template

The **envelope is canonical in**
[[system/workflows/peer-orchestrator-protocol]] § Review format. Do not invent a second
review grammar — this page supplies the optional *payload* that goes inside it for wiki
and multi-file reviews.

## The envelope (required)

Every `.review` marker uses exactly this, per the protocol:

```text
STATUS: ACCEPT | REJECT
REVIEW_TYPE: orchestrator | executor-qa
TIMESTAMP: <ISO 8601 UTC — generate with `date -u +%Y-%m-%dT%H:%M:%SZ`>
REVIEWER: hermes | cc | metis | codex | <oc-agent-id>
TARGET: /root/tasks/<task>.done
FINDINGS:
  - none | specific issue
REQUIRED_FIXES:
  - none | specific fix task
```

A longer narrative review may accompany it as a `.md` file in `/root/reviews/` — that is
common and fine — but it must carry `STATUS:` and `REVIEWER:` in its first few lines so
the audit trail stays greppable.

`REVIEW_TYPE` is what separates accountability from instrumentation: only a peer
orchestrator's `orchestrator` ACCEPT closes a spec. A dispatched OC agent's review is
`executor-qa` — it informs the decision, it never replaces it.

## Optional payload — wiki / multi-file checklist

For batch wiki work or any review spanning many files, append this inside `FINDINGS:`.
It is a **checklist, not a format** — the value is the questions, not the ASCII banners.

```text
FORMAT
  frontmatter          PASS | FAIL (<n> files)
  wikilinks            PASS | FAIL (<n> broken)
  template_sections    PASS | FAIL (<n> structural)
  placeholder_leftovers PASS | FAIL (<n> unresolved TODOs)

CONSISTENCY
  cross_references          PASS | PARTIAL | FAIL
  intra_batch_contradictions PASS | FAIL

COMPLETENESS
  spec_pages_updated  <actual>/<expected> (missing: <list | none>)
  index_updated       PASS | FAIL
  log_updated         PASS | FAIL
  done_marker_format  PASS | FAIL
```

## History — why this page shrank

Until 2026-08-10 this page carried a full `WIKI REVIEW REPORT` block with its own
`OVERALL_STATUS` and `RECOMMENDATION: ACCEPT | FIX_TASK_GRUNT | FIX_TASK_LEAD |
SCHEMA_ATTENTION` vocabulary — a third review grammar competing with the protocol's.

Checked against practice: of **401** files in `/root/reviews/`, that format appeared in
**2**, and `FIX_TASK_LEAD` in **0**. It also routed fixes to `lead`, which has been an
explicit-only lane since well before this page was last touched. The format was retired
rather than maintained; the genuinely useful part — the checklist above — was kept.
