---
type: system-decision
title: April 2026 Notion Integration Decisions
slug: 2026-04-notion-integration
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/specs/13-notion-skills.md
  - /root/specs/14-claude-md-notion-skills.md
  - /root/specs/15-fix-grunt-agent-refs.md
  - /root/tasks/13-notion-skills.done
  - /root/tasks/14-claude-md-notion-skills.done
  - /root/tasks/15-fix-grunt-agent-refs.done
dates: 2026-04-21 to 2026-04-21
tags: [ops, decisions, notion, routing]
---

## Context

The Notion workstream needed reusable CC-side behavior before any API automation. At the same time, the agent roster had just changed, which meant discovery docs and routing references had to be corrected before those new skills could be used safely in future sessions.

## Decisions

1. Add three CC playbook skills, `notion-ingest`, `notion-push`, and `notion-query`, before building any runtime integration.
2. Document those Notion skills directly in `CLAUDE.md` so future CC sessions discover them in the same place as the wiki skills.
3. Update stale references that mapped grunt work to `agent:main:main`, and replace them with the dedicated `agent:grunt:main` session key where appropriate.
4. Keep this whole pass documentation-only, with no live Notion writes and no integration code.

## Outcome

The Notion skill surface is now in place, discoverable, and aligned with the current agent-routing model. The routing cleanup also corrected future wiki and Notion prompts that depended on the new grunt profile. One oddity remains in the record: the `.done` marker for task 15 carries a January timestamp even though the work belongs to the April 21 documentation pass, so chronology should be taken from the surrounding specs and edits instead of that single timestamp.

## Artifacts

- [[#13-notion-skills|13-notion-skills]]
- [[#14-claude-md-notion-skills|14-claude-md-notion-skills]]
- [[#15-fix-grunt-agent-refs|15-fix-grunt-agent-refs]]

### 13-notion-skills
- Spec: /root/specs/13-notion-skills.md
- Done: /root/tasks/13-notion-skills.done

### 14-claude-md-notion-skills
- Spec: /root/specs/14-claude-md-notion-skills.md
- Done: /root/tasks/14-claude-md-notion-skills.done

### 15-fix-grunt-agent-refs
- Spec: /root/specs/15-fix-grunt-agent-refs.md
- Done: /root/tasks/15-fix-grunt-agent-refs.done
