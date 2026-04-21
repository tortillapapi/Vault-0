---
type: system-skill
title: Task Spec Template
slug: task-spec-template
source_path: /root/.claude/skills/task-spec-template.md
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
tags: [ops, skill, templates]
---

## Purpose
Standard templates for writing task specs and execution prompts. Use this skill to ensure consistent task documentation across the orchestration workflow.

## Contents

# Task Spec Template

When creating task specs, use this structure:

## Spec File Format: specs/<##-task-name>.md

# Task: [TASK_NAME]

## Objective
[1-2 sentence clear description]

## Dependencies
- [List task numbers that must complete first, or "None"]

## Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]

## Inputs
- [Files to read]

## Outputs
- [Files to create with exact paths]

## Technical Notes
[Implementation hints, constraints]


## Execution Prompt Format: tasks/<##-task-name>.txt

TASK: [name]
OBJECTIVE: [goal]
DEPENDENCIES COMPLETED: [list or None]
INSTRUCTIONS:
1. [Step]
2. [Step]
FILES TO CREATE/MODIFY:
- [path]
COMPLETION: Create tasks/[name].done with summary
