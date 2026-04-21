---
type: system-skill
title: Fix and Iterate Skill
slug: fix-iterate
source_path: /root/.claude/skills/fix-iterate.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, fixes]
---

## Purpose
Create targeted, minimal fix tasks when review identifies specific issues. Use this skill to scope precise corrections without over-refactoring.

## Contents

# Fix and Iterate Skill

## Purpose
Create targeted fix tasks when review identifies issues.

## Process

### 1. Analyze Issue
- Read the review that found the problem
- Read the original spec
- Look at the problematic code

### 2. Create Fix Spec
Write specs/fix-<issue>.md with:
- What's wrong
- Root cause
- Specific changes needed

### 3. Create Fix Prompt
Write tasks/fix-<issue>.txt with:
- Precise description of the bug
- Exact file and location
- What to change
- How to verify the fix

### 4. Keep Fixes Small
- One issue per fix task
- Don't refactor beyond the fix
- Test after fixing

## Fix Prompt Template
TASK: fix-[issue-name]
PROBLEM: [what's wrong]
FILE: [exact path]
CURRENT: [what it does now]
EXPECTED: [what it should do]
FIX: [specific change]
VERIFY: [how to test]
COMPLETION: Create tasks/fix-[issue-name].done
