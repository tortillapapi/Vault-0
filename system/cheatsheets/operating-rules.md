---
type: system-cheatsheet
title: Operating Rules (standing feedback)
slug: operating-rules
last_synced: 2026-05-26
maintainer: cc-oc-orchestrator
source: CC auto-memory (feedback entries)
tags: [ops, rules, feedback, shared-brain]
---

# Operating Rules

Standing rules distilled from real sessions. Apply by default — they bind CC,
Codex, and OpenClaw equally (and Hermes once installed).

## Messaging & OC interaction
- **Telegram: use `openclaw message send`, never `agent --deliver`.** `agent`
  spins a ~60s inference turn and can lock sessions; `message send` is a ~10s
  direct relay. Chat ID 1207164084. See `system/cheatsheets/oc-cli`.
- **Read the OC CLI cheatsheet before any `openclaw` command.** Hard gate — no
  exceptions, even if you think you remember the syntax.

## Dispatch & verification
- **OC main can self-orchestrate multi-phase specs (3+ phases).** Dispatch the
  whole spec to `main` with pre-approved handoffs + a `.progress` file instead of
  CC driving each phase (~10k tokens / ~3× faster). Not for single-phase work or
  phases needing CC judgment between them.
- **OpenCode-Go agents have a weak clock (provider-wide, not just Kimi).** `grunt`
  and `grunt-eng` now run DeepSeek V4 Flash by default and `re-review` runs Qwen3.6,
  but hosted models can still misread current date/time. Always inject exact dates
  in task prompts and require `date -u` for completion markers; verify `.done`
  times with `stat -c %y` when audit accuracy matters. OpenAI agents
  (main/lead/mid on gpt-5.5) are unaffected.
- **Verification checks must match unique content text**, not numeric prefixes or
  assumed file/process structure. Use `pgrep -af <name>` not `systemctl is-active`
  unless the target is confirmed a systemd unit (OpenClaw runs many plain
  processes). Prefer `>= N` over `== N` for counts that can grow.
- **Check systemd state before dispatching run-type tasks** on any project with a
  `systemd/` dir — a live timer can silently race your work.
- **Two-stage review chain over grunt work.** Grunt-tier output (`grunt`,
  `grunt-eng`) goes through `re-review` (Qwen3.6) for first-pass QA, then `mid`
  (GPT-5.5, medium) as a second review, before the orchestrator approves. Applies
  to all grunt work, not just the email parser.

- **Dispatch cost discipline — keep OpenAI for judgment.** OpenAI/gpt-5.5 quota
  is the scarce SHARED pool (Codex CLI + OC `main`/`lead`/`mid`/`pa` all draw on
  one ChatGPT account); DeepSeek (`grunt`/`grunt-eng`) and Qwen (`re-review`) are
  separate pools. Default mechanical/coding work to `grunt-eng` and docs/formatting
  to `grunt`; reserve `main`/`lead`/`mid` (OpenAI) for genuine synthesis,
  cross-file judgment, or multi-phase self-orchestration. Cap thinking at `medium`
  for well-specified contracts — `xhigh` only for open-ended problems (reasoning
  tokens dominate the bill). Do feasibility/investigation (`ls`/`grep`/`curl`) on
  the orchestrator side directly; don't spend an OpenAI agent on greppy work, and
  skip costly liveness probes (a PONG to `main` is ~60k tokens). Watch the Mission
  Control Usage tab to stay ahead of the OpenAI 5h rolling window.

## Session hygiene
- **Manage OC main's context proactively.** Don't ask every session, but check
  OC main's context % before a heavy/multi-phase dispatch, and recommend `/clear`
  (not `/compact`) after a multi-phase spec completes — disk state is canonical.

## Project guardrails
- **Never suggest reviving the Inventory Tracker / Inventory Dashboard.** User
  retired it permanently (2026-04-27); treat as if it never existed. The Orders
  Dashboard (spec 42) is the reference implementation for any future dashboard.
- **The `notion/` mirror is not reference material.** It is a one-way sink of the
  user's Notion workspace. Touch it only when changing Notion itself or adding new
  info destined for Notion. Exclude it from context greps
  (`--exclude-dir=notion`). The `system/skills/notion-*` docs are NOT part of the
  mirror and remain readable.
- **Every vault-touching spec ends with git commit + push** (`git pull --rebase`
  first; never force-push / reset --hard / checkout --theirs). Local-only edits
  drift the VPS/GitHub/Mac trio apart.
- **Back up `/root` config files before hand-editing — they are not
  git-versioned.** Before editing/trimming any non-vault config or instruction
  file under `/root` (`/root/CLAUDE.md`, `/root/AGENTS.md`,
  `/root/.openclaw/workspace/AGENTS.md`), make a dated backup first
  (`cp file file.bak-YYYY-MM-DD`) as a spec Phase 0. `/root` has no version
  history, so the `.bak` is the only rollback. (Vault files are exempt — they
  are git-versioned; see the vault commit+push rule.)
