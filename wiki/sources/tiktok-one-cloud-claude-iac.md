---
type: source
source_type: bookmark
title: Pick one cloud, let Claude write the infrastructure-as-code
slug: tiktok-one-cloud-claude-iac
author: Eric (@codingai)
date_published:
date_ingested: 2026-06-23
raw_path: raw/bookmarks/ai-folder-pilot-2026-06-23-transcripts.md
url: https://www.tiktok.com/@codingai/video/7641308739059961101
tags: [tiktok, ai, infrastructure, architecture, iac]
priority: core
ingest_mode: fast
domain_tags: [tech, ai]
last_accessed: 2026-06-23
access_count: 0
---

## Summary

Argues that stitching many SaaS services together (Vercel + Supabase + Stripe +
the Claude API) gives you too many "touch points" and is hard to manage.
Recommendation: pick ONE cloud provider (AWS / Google Cloud / Azure), snapshot
your intended system, tell the AI "I need all these things in <cloud>", and let
it emit a single **infrastructure-as-code** file — one account, one bill, no
dependency mess.

## Key Points (from transcript)

1. Multi-SaaS glue = too many touch points to manage.
2. Consolidate on a single cloud (AWS / GCP / Azure).
3. Workflow: describe/snapshot the system → AI writes the IaC file → deploy in
   your own account.
4. Framed as "thinking like a real software engineer."

## Action Items

- Keep as a default heuristic for new RareForceOne builds: one cloud + LLM-
  generated IaC over a SaaS patchwork.
- Concrete experiment: have Claude Code emit Terraform/IaC for one small existing
  system and evaluate output quality.

## Transcript

> Vibe coders, why are we doing this? ...too many touch points... pick one cloud
> platform — AWS, Google Cloud, or Azure. Take a snapshot and tell your AI "I need
> all these things in Azure." It writes a single file — infrastructure as code —
> and you're set up in your account. No more dependency mess. (Full verbatim in raw_path.)

## Wiki Pages Updated

[[ai]], [[claude-code]]
