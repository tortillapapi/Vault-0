---
type: system-decision
title: April 2026 Fallback Pipeline Decisions
slug: 2026-04-fallback-pipeline
last_synced: 2026-04-21
maintainer: cc-oc-orchestrator
derived_from:
  - /root/specs/01-gemini-client.md
  - /root/specs/02-llm-fallback-parser.md
  - /root/specs/03-wire-fallback-pipeline.md
  - /root/specs/04-gemini-subagent.md
  - /root/specs/05-rewire-gemini-client.md
  - /root/tasks/01-gemini-client.done
  - /root/tasks/02-llm-fallback-parser.done
  - /root/tasks/03-wire-fallback-pipeline.done
  - /root/tasks/04-gemini-subagent.done
  - /root/tasks/05-rewire-gemini-client.done
dates: 2026-04-17 to 2026-04-17
tags: [ops, decisions, pipeline, gemini, email]
priority: core
domain_tags: [pipeline, parser, oc-system]
last_accessed: 2026-04-22
access_count: 0
---

## Context

The inventory-tracker ingest flow needed a practical fallback when the rule-based parser could not confidently extract order or shipping data. The chosen direction was to keep the existing parser first, then add LLM fallback behavior while moving model credentials and runtime control into OpenClaw instead of the app itself.

## Decisions

1. Standardize the project on Gemini defaults by adding a dedicated `gemini_client.py` wrapper and setting config defaults to `gemini` with `gemini-2.0-flash` as the documented model.
2. Replace the stub `LlmFallbackParser` with a real parser that maps structured LLM output into `ParsedEmail` and `ParsedItem`, with a safe empty fallback on error.
3. Keep `GenericParser` as the first pass, use `0.5` as the fallback threshold, and let the higher-confidence parse win.
4. Create a dedicated OpenClaw agent named `email-parser` on `google/gemini-2.5-flash` so inference can use OC-managed credentials and model settings.
5. Rewire `app/gemini_client.py` to call `openclaw agent --agent email-parser --local --json` through `subprocess.run()` instead of importing the Google SDK directly.

## Outcome

The fallback pipeline shipped end to end in one day. Application code now performs rule-based parsing first, escalates weak parses to an OC-managed Gemini subagent, and returns empty data safely when the LLM path fails. The main tradeoff is tighter coupling to OpenClaw availability and subprocess execution, but that was accepted in exchange for centralizing auth and model management.

## Artifacts

- [[#01-gemini-client|01-gemini-client]]
- [[#02-llm-fallback-parser|02-llm-fallback-parser]]
- [[#03-wire-fallback-pipeline|03-wire-fallback-pipeline]]
- [[#04-gemini-subagent|04-gemini-subagent]]
- [[#05-rewire-gemini-client|05-rewire-gemini-client]]

### 01-gemini-client
- Spec: /root/specs/01-gemini-client.md
- Done: /root/tasks/01-gemini-client.done

### 02-llm-fallback-parser
- Spec: /root/specs/02-llm-fallback-parser.md
- Done: /root/tasks/02-llm-fallback-parser.done

### 03-wire-fallback-pipeline
- Spec: /root/specs/03-wire-fallback-pipeline.md
- Done: /root/tasks/03-wire-fallback-pipeline.done

### 04-gemini-subagent
- Spec: /root/specs/04-gemini-subagent.md
- Done: /root/tasks/04-gemini-subagent.done

### 05-rewire-gemini-client
- Spec: /root/specs/05-rewire-gemini-client.md
- Done: /root/tasks/05-rewire-gemini-client.done
