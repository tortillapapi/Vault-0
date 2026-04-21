---
type: system-skill
title: Review OpenClaw Work
slug: review-oc-work
source_path: /root/.claude/skills/review-oc-work.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, review]
---

## Purpose
Review code and files created by OpenClaw execution against specs. Use this skill to evaluate completion quality and decide on approval, fixes, or escalation.

## Contents

# Review OpenClaw Work

## Purpose
Review code and files created by OpenClaw execution and decide next steps.

## Process

### 1. Gather Completed Work
Look for .done and .blocked files in tasks/

### 2. For Each Completed Task
- Read the .done file summary
- Review actual files created/modified
- Check against the spec in specs/

### 3. Evaluate
- Does it meet acceptance criteria?
- Code quality acceptable?
- Any issues or bugs?

### 4. Output Review
Create reviews/<task-name>-review.md with:
- Pass/Fail status
- Issues found
- Next steps or fix tasks needed

## Checklist
- [ ] All acceptance criteria met
- [ ] No obvious bugs
- [ ] Follows project conventions
- [ ] Error handling present
- [ ] Tests pass (if applicable)

## Verdicts
- APPROVED: Move to next phase
- NEEDS_FIXES: Create fix tasks
- BLOCKED: Needs human intervention
