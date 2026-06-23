---
type: source
source_type: bookmark
title: Pick one cloud, let Claude write the infrastructure-as-code
slug: tiktok-one-cloud-claude-iac
author: Eric (@codingai)
date_published:
date_ingested: 2026-06-23
raw_path: raw/bookmarks/ai-folder-pilot-2026-06-23.md
url: https://www.tiktok.com/@codingai/video/7641308739059961101
tags: [tiktok, ai, claude-code, infrastructure, architecture]
priority: core
ingest_mode: fast
domain_tags: [tech, ai]
last_accessed: 2026-06-23
access_count: 0
---

## Summary

An opinion clip arguing the popular "Vercel + Supabase + Stripe + Claude API"
glue-stack is a fragile Frankenstein. The "big-tech" alternative: pick ONE cloud,
draw the system architecture, snapshot the diagram, and have [[claude-code]] / an
LLM generate the infrastructure-as-code from it — yielding one bill, one account,
one mental model. This is an architecture-philosophy take, not a step-by-step.

## Key Points

1. Multi-SaaS glue stacks add operational + billing + mental overhead.
2. Consolidate onto a single cloud provider.
3. Workflow: diagram the system → feed the diagram to the LLM → it writes the IaC.
4. Value claim: one bill / one account / one way to reason about the system.

## Action Items

- Actually useful heuristic to keep: for new builds, default to one cloud + LLM-
  generated IaC instead of stitching SaaS. Worth applying to any future RareForceOne
  infra project.
- Experiment to try: take an existing small system diagram, have Claude Code emit
  Terraform/IaC, and evaluate the output quality.

## Wiki Pages Updated

[[ai]], [[claude-code]]
