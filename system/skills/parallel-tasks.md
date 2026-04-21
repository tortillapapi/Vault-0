---
type: system-skill
title: Parallel Task Execution
slug: parallel-tasks
source_path: /root/.claude/skills/parallel-tasks.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, parallelism]
---

## Purpose
Execute multiple independent OpenClaw tasks simultaneously. Use this skill when tasks have no dependencies and can safely run in parallel.

## Contents

# Parallel Task Execution

## When to Use
Multiple independent tasks with no dependencies between them.

## Process

### 1. Identify Parallel Groups
Tasks numbered like 02a, 02b, 02c can run simultaneously.

### 2. Create Batch Commands
Group independent tasks:

# Phase 1 (sequential)
./scripts/oc-run.sh tasks/01-setup.txt
# Wait for completion

# Phase 2 (parallel)
./scripts/oc-run.sh tasks/02a-feature.txt &
./scripts/oc-run.sh tasks/02b-other.txt &
wait

# Phase 3 (sequential, depends on Phase 2)
./scripts/oc-run.sh tasks/03-integrate.txt

### 3. Monitor
Check tasks/*.done files before starting dependent phases.

## Limits
- Max 3-5 parallel tasks recommended
- Always wait between dependent phases
- Check all .done files before proceeding
