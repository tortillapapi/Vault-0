---
type: topic
title: AI (TikTok bookmarks folder)
slug: ai
tags: [tiktok-folder, ai]
priority: core
domain_tags: [tech, ai]
last_accessed: 2026-06-23
access_count: 0
---

## What this is

The living index for the TikTok **"AI"** bookmark folder
(`@tortilla_papi/collection/AI`). Each saved video is captured as a `bookmark`
source page with creator + caption + **full audio transcript** (local STT via
`/root/scripts/tiktok-transcribe.py`). Raw transcripts live under `raw/bookmarks/`.

## Bookmarks

| Saved item | Creator | What it actually is (from transcript) | Action |
|---|---|---|---|
| [[tiktok-colton-ai-automation-setup]] | Colton Holland | Set up a **RAG system for Claude Code** — store YouTube/voice-memo/photo data in chunks; send a YT link → auto-transcript → chunk → store; Telegram voice-memo control | **Build next:** YouTube-link ingestion + retrieval layer for our own vault |
| [[tiktok-dylanworr-build-cool-tech-mindset]] | dylanworr | **Build your own second-brain memory system** — local embedded DB + vector rows + local embedding model; hybrid on-disk/cloud storage | **Decide:** add a vector/semantic layer to the wiki? |
| [[tiktok-one-cloud-claude-iac]] | Eric (@codingai) | Ditch the SaaS Frankenstein stack: pick ONE cloud, let the AI write the infrastructure-as-code | Apply as default infra heuristic; try Claude→Terraform |
| [[tiktok-claude-room-redesign]] | AI Honeycove | 3-step Claude Code "Banana Skill" + Google AI Studio room redesign from one photo | Follow the 3 steps if a makeover comes up |

## Categorization note

Transcripts changed the picture vs. captions. Two of these four are really about
**building second-brain / RAG systems** ([[second-brain-wiki]]) — directly
relevant to this very project — not the "mindset" or "vague hook" the captions
implied. The other two are **AI dev-workflow** tips ([[claude-code]]). As the
folder grows, the natural split is `second-brain-and-rag` vs `ai-dev-workflows`.
This is the "folder optimization" payoff: the machine reclassifies on *content*,
not the title you happened to save it under.

## Meta: this folder is feeding its own tooling

Both top entries describe the next steps for the vault itself (auto-transcript
ingestion — now built — plus a retrieval/embedding layer). The bookmarks are
literally a roadmap for the second brain ingesting them.
