---
type: system-decision
title: April 2026 Inventory Pipeline Operations Decisions
slug: 2026-04-inventory-pipeline-ops
last_synced: 2026-04-22
maintainer: cc-oc-orchestrator
derived_from:
  - /root/specs/24-inventory-dashboard.md
  - /root/specs/25-tiered-parser.md
  - /root/specs/26-parser-intelligence.md
dates: 2026-04-22
tags: [ops, decisions, inventory, pipeline, parser, dashboard]
priority: core
domain_tags: [pipeline, parser, dashboard, billing]
last_accessed: 2026-04-22
access_count: 0
---

## Context

After the Gmail ingest pipeline was confirmed working (task 23), several operational issues required architectural decisions. The pipeline needed to move from a prototype with Gemini dependency to a production-ready, cost-free system with human oversight and continuous improvement mechanisms.

## Decisions

1. **Gemini API billing model mismatch** — AI Studio API keys bill to AI Studio prepayment, not GCP credits. Vertex AI requires service account OAuth2. Decision: use OC-bundled models (GLM-5.1 + GPT-5.3-codex) instead of any Google API to avoid billing complexity.

2. **Tiered parser architecture** — primary parse by GLM-5.1 (email-parser agent, free, handles ~70-80% of structured emails); review re-parse by GPT-5.3-codex (mid agent, free, smarter); human review queue for remainder. Confidence thresholds: GLM ≥ 0.7 = processed; mid ≥ 0.8 = processed; mid < 0.5 = auto-processed as unknown; 0.5–0.8 = human review.

3. **Noise pre-filter added before any LLM call** — domain blocklist (LinkedIn, banks, travel, restaurants, social media) + subject keyword matching. Only emails with order/shipping signals reach the LLM. Keeps review queue focused on genuine ambiguity.

4. **Parser feedback loop** — dashboard confirm/reject/correct actions write to parser_feedback table. Top 5 confirmed examples prepended as few-shot context on every LLM call. Parser improves automatically with use.

5. **Dashboard built as Flask app at port 5001** — orders list, order detail, raw messages, review queue with inline confirm/correct/reject, seed UI for manual training examples.

6. **Vertex AI service account key retained but unused** — stored at secrets/vertex-sa-key.json for future use if GLM quality proves insufficient.

## Outcome

Pipeline cost drops to zero (OC-bundled models). Review queue stays focused (noise filter). Parser improves over time (feedback loop). Dashboard provides operational visibility and human-in-the-loop oversight.

## Artifacts

- [[decisions/2026-04-fallback-pipeline|2026-04-fallback-pipeline]] — prior Gemini-based pipeline decisions
- [[topics/inventory-tracker-pipeline|inventory-tracker-pipeline]] — rolling synthesis of the inventory tracker system
