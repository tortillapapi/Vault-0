---
type: topic
title: Inventory Tracker Pipeline
slug: inventory-tracker-pipeline
created: 2026-04-22
last_updated: 2026-04-22
tags: [ops, gmail, pipeline, inventory, parser]
thesis_version: 1
priority: core
domain_tags: [pipeline, parser, dashboard]
last_accessed: 2026-04-22
access_count: 0
---

## Current Thesis

The inventory tracker is an automated Gmail ingestion pipeline that parses purchase, order, and shipping emails from a personal Gmail inbox and stores structured data in SQLite. The system is designed for tracking resale inventory from retailers like Amazon, eBay, Fanatics, PayPal, and Etsy.

The pipeline operates on a tiered parsing architecture with confidence-based routing. Primary parsing uses GLM-5.1 (free, bundled, handles 70-80% of well-structured emails). Emails with low confidence (< 0.7) are re-parsed by GPT-5.3-codex (mid tier, smarter, still free). A noise filter prevents irrelevant emails (LinkedIn, banks, travel, restaurants) from reaching any LLM, keeping the human review queue focused on genuine ambiguity rather than spam.

The system includes a feedback loop: dashboard actions (confirm, reject, correct) write to a parser_feedback table, and the top 5 confirmed examples are prepended as few-shot context on every LLM call. This allows the parser to improve automatically with use without requiring manual retraining.

## Supporting Evidence

- Tiered parser reduces costs to zero by using OC-bundled models (GLM-5.1 + GPT-5.3-codex)
- Noise filter eliminates ~60% of inbox volume before any LLM call
- Feedback loop provides continuous improvement without dedicated training cycles
- Dashboard at http://srv1535917.hstgr.cloud:5001 provides operational visibility

## Open Questions

- Will GLM-5.1 quality remain sufficient, or will Vertex AI integration be needed?
- How many training examples are needed before the parser reaches "good enough" accuracy?
- Should the system eventually support other email providers beyond Gmail?

## Contradictions

- Early design used Gemini 2.5 Flash (Google API) but quota/billing issues forced a switch to OC-bundled models
- Original plan had no human review queue; operational reality required adding one for 0.5–0.8 confidence band

## History

- **v1 (2026-04-22)** — Initial topic creation. Tiered parser, noise filter, dashboard, and feedback loop operational.

## Related

- [[decisions/2026-04-fallback-pipeline|2026-04-fallback-pipeline]] — initial Gemini-based pipeline decisions
- [[decisions/2026-04-inventory-pipeline-ops|2026-04-inventory-pipeline-ops]] — operational architecture decisions (this session)

## Sources

- /root/reviews/session-2026-04-22-p2-handoff.md
- /root/reviews/session-2026-04-22-handoff.md
