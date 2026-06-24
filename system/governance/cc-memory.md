---
type: governance-mirror
source_path: /root/.claude/projects/-root/memory/MEMORY.md, /root/.claude/projects/-root/memory/feedback_always_check_oc_cheatsheet.md, /root/.claude/projects/-root/memory/feedback_check_systemd_before_run_tasks.md, /root/.claude/projects/-root/memory/feedback_kimi_timestamps.md, /root/.claude/projects/-root/memory/feedback_never_revive_inventory_dashboard.md, /root/.claude/projects/-root/memory/feedback_notion_mirror_not_reference.md, /root/.claude/projects/-root/memory/feedback_oc_main_self_orchestration.md, /root/.claude/projects/-root/memory/feedback_oc_session_hygiene.md, /root/.claude/projects/-root/memory/feedback_oc_telegram_direct.md, /root/.claude/projects/-root/memory/feedback_vault_git_commit_push.md, /root/.claude/projects/-root/memory/feedback_verification_check_specificity.md, /root/.claude/projects/-root/memory/project_n8n_order_parser.md, /root/.claude/projects/-root/memory/project_order_dashboard.md, /root/.claude/projects/-root/memory/reference_agent_dispatch.md, /root/.claude/projects/-root/memory/reference_oc_cli_cheatsheet.md, /root/.claude/projects/-root/memory/user_role_orchestrator.md
last_synced: 2026-05-26
maintainer: cc-oc-orchestrator
tags: [governance, mirror, audit]
---
> ⚠️ READ-ONLY MIRROR of /root/.claude/projects/-root/memory/*.md. Do not hand-edit — re-sync via spec 54.

**Lines:** 20 / 25 — 🟢 within

---

## MEMORY.md (20 lines)

> Canonical/shared versions of the ops + project entries below live in the vault at
> `system/` (registry: `system/resources/registry.md`; rules: `system/cheatsheets/operating-rules.md`;
> roster: `system/configs/openclaw-agents.md`; projects: `system/projects/`). If an entry here
> disagrees with the vault, the vault wins — these are thin local caches for CC autoload.

- [OC Telegram Direct Send](feedback_oc_telegram_direct.md) — Use `message send` not `agent --deliver` for Telegram; 10x faster
- [OC CLI Cheatsheet](reference_oc_cli_cheatsheet.md) — Full quick-reference for OC commands: messaging, agents, tasks, cron, diagnostics
- [Always Check OC Cheatsheet](feedback_always_check_oc_cheatsheet.md) — MUST read OC cheatsheet before every OpenClaw interaction, no exceptions
- [Agent Dispatch Rules](reference_agent_dispatch.md) — Which OC agent (lead/mid/grunt) to use for which task complexity
- [User Role & Orchestration](user_role_orchestrator.md) — User uses CC as orchestrator brain, OC as execution layer; accounts and contact info
- [Kimi Weak Clock](feedback_kimi_timestamps.md) — Grunt agent (Kimi K2.5) writes wrong dates in .done files; verify with stat if audit matters
- [OC Main Self-Orchestration](feedback_oc_main_self_orchestration.md) — Dispatch multi-phase specs to OC main in one call with pre-approved handoffs; saves ~10k CC tokens, 3× faster
- [Check systemd before run tasks](feedback_check_systemd_before_run_tasks.md) — On projects with a systemd/ dir, check timer state first; live timers silently race your work
- [n8n Order Parser](project_n8n_order_parser.md) — Gmail→Sheets automation: 3 workflows, account_b=eBay; auto-deactivates on errors, won't self-re-enable
- [Orders Dashboard v1.0](project_order_dashboard.md) — DECOMMISSIONED 2026-06-24 (spec 151); Flask + SQLite dashboard was on VPS port 5002, now stopped/disabled/masked. Legacy sheet trashed.
- [Never revive Inventory Dashboard](feedback_never_revive_inventory_dashboard.md) — User permanently retired the inventory-tracker pipeline + dashboard; do not propose revival or partial reuse
- [Vault commits required](feedback_vault_git_commit_push.md) — Every spec that writes to /root/obsidian-vault must end with git commit + push, or Mac/GitHub/VPS drift
- [Notion mirror not reference](feedback_notion_mirror_not_reference.md) — /root/obsidian-vault/notion/ is one-way mirror of Notion; never read as reference/learning material
- [Verification check specificity](feedback_verification_check_specificity.md) — Spec verification commands must match content text, not numeric prefixes or assume systemd; brittle checks falsely block
- [OC Session Hygiene](feedback_oc_session_hygiene.md) — Proactively suggest /clear between unrelated specs; check OC main context before heavy dispatches (not every session)

## feedback_always_check_oc_cheatsheet.md (11 lines)

---
name: Always reference OC cheatsheet before OC interactions
description: User requires CC to check the OC CLI cheatsheet memory before every OpenClaw interaction — no exceptions
type: feedback
originSessionId: a238ce87-1da8-45a0-bbab-7159be6a51a6
---
Before ANY interaction with OpenClaw (sending messages, running agents, managing cron, checking status, delegating tasks), ALWAYS read the OC CLI cheatsheet at `/root/.claude/projects/-root/memory/reference_oc_cli_cheatsheet.md` first.

**Why:** User was burned by a 60s+ failed interaction that should have taken 10s. The cheatsheet contains the correct, fast commands for every OC operation. Skipping it risks repeating the same mistakes (wrong command, session locks, timeouts).

**How to apply:** Treat this as a hard gate — read the cheatsheet before issuing any `openclaw` command. No exceptions, even if you think you remember the syntax.

## feedback_check_systemd_before_run_tasks.md (32 lines)

---
name: Check systemd state before dispatching run-type tasks
description: Before dispatching ingest/run tasks on a project that has a systemd/ dir, check if its timers are already installed and enabled. A live timer can silently race with your work.
type: feedback
originSessionId: 0b15eae4-0b73-44a1-b597-04e33905b000
---
Before dispatching a task that runs a background job (ingest, sync,
reconciliation, etc.) on a project that ships systemd unit files,
check whether those units are already installed and enabled. Command:

```bash
ls <project>/systemd/ && systemctl list-unit-files | grep <project-prefix>
systemctl list-timers --all | grep <project-prefix>
systemctl is-active <service>
```

**Why:** On the inventory-tracker Gmail pipeline (2026-04-22), the
`inventory-tracker-ingest.timer` was already enabled and firing every
15 minutes against the production label — unknown to CC at session
start. The timer was quietly racing task 23's controlled smoke run:
the 29 → 39 → 46 row drift mid flagged was the timer, not normal
upsert behavior. At the same time a single timer fire had run for 47
minutes in a retry loop against the broken Gemini fallback
(`Failed to parse agent response: Expecting value` = Gemini 429).

**How to apply:** If the project has `systemd/` units, make the
systemd state check part of the session-resume pass, not just when
you're explicitly doing automation work. If a timer is already live
and the pipeline it runs has a known defect (e.g. upstream API down),
stop + disable it before dispatching tasks that depend on the pipeline
producing clean output. Document the stop as a deliberate orchestrator
decision in the session handoff — don't leave the user to discover it.

## feedback_kimi_timestamps.md (25 lines)

---
name: Kimi has a weak clock — don't trust .done timestamps from grunt agent
description: The grunt agent (opencode-go/kimi-k2.5) writes wrong dates in .done completion markers; its internal clock lags real time by months.
type: feedback
originSessionId: f2acb00a-a3ae-402a-8fbc-68352a4bb5c0
---
Kimi K2.5 running under the `grunt` OC agent does not have reliable
access to current date/time. Observed on 2026-04-21: Kimi wrote
`TIMESTAMP: 2026-01-15T00:00:00Z` in a .done file when the actual
completion time was that same April day — ~3 months off.

**Why:** Likely the model's training-cutoff date leaking through as
"now" because OC isn't injecting a system-prompt clock for opencode-go
models. Other agents (gpt-5.4 on `main`/`lead`, gpt-5.3-codex on `mid`)
have correct timestamps in their .done files.

**How to apply:**
- When dispatching to `grunt` (Kimi) and audit trail matters, either
  (a) generate the timestamp yourself in the task prompt and tell Kimi
  to copy it verbatim, or (b) verify .done timestamps against
  `stat -c %y <file>` before trusting them.
- For routine mechanical edits where timestamp precision is cosmetic,
  ignore the issue — it's not affecting the work itself.
- If this pattern gets annoying, consider filing against OC for a
  system-prompt clock injection on opencode-go agents.

## feedback_never_revive_inventory_dashboard.md (29 lines)

---
name: Never suggest reviving the Inventory Tracker / Inventory Dashboard
description: User has permanently retired the inventory-tracker pipeline + dashboard. Treat as a closed chapter; do not propose revival or partial reuse.
type: feedback
originSessionId: e4b0aa92-9380-472c-97d5-ba492a0d088c
---
**Rule**: Never suggest reviving, restoring, or partially reusing the
inventory-tracker pipeline or its Flask dashboard.

**Why**: User stated explicitly on 2026-04-27: "Lets completely forget
the inventory dashboard, I will NEVER revive that project. It's just a
footnote of what DOESN'T work." The pipeline was killed (spec 36) and
archived (spec 37) the same day, and the user wants that decision to
stay decisive.

**How to apply**:
- If the user mentions wanting "a dashboard" or "inventory tracking",
  do NOT reference the old inventory-tracker as a starting point. Treat
  it as if it never existed.
- Do not suggest reusing its Flask scaffold, parsers, schema, or
  systemd patterns — even when they'd save time. The Orders Dashboard
  (spec 42, v1.0) is the new reference implementation for any future
  dashboard work on this VPS.
- The archive at /root/archive/inventory-tracker-old-2026-04/ exists for
  audit only. Do not propose pulling artifacts back out of it.
- If technical questions surface that genuinely need historical context
  (e.g. "what credentials did the old project use"), answer factually
  but do not editorialize about whether the system "could be brought
  back" — it can't, that's settled.

## feedback_notion_mirror_not_reference.md (39 lines)

---
name: Never reference the Notion mirror as learning material
description: /root/obsidian-vault/notion/ is a one-way mirror of the user's Notion workspace; treat as Notion state, never as general reference.
type: feedback
originSessionId: 22a1e361-9547-4470-a433-281331367e19
---
**Rule**: The `/root/obsidian-vault/notion/` directory is a one-way
reflection of the user's Notion workspace. It must NEVER be read as
reference material, learning context, or authoritative facts for
unrelated work. Touch it ONLY when:

1. Modifying the Notion workspace itself (structure, pages, properties)
2. Adding new information that's destined for Notion

**Why**: User stated explicitly on 2026-04-28: "the part of my
wiki/Obsidian vault that is just a copy of my Notion workspace should
never be referenced as a reference or learning document for you, Codex,
or Openclaw. It should only be referenced when working on changing
something about/in the Notion workspace itself or adding new information
to it."

The contents are derived from upstream Notion — answering questions
based on them risks repeating stale Notion state, conflating the user's
Notion organization with general truth, or anchoring decisions on what
is essentially a snapshot.

**How to apply**:
- When grepping/reading the vault for context, EXCLUDE `notion/`:
  `grep -r ... /root/obsidian-vault/ --exclude-dir=notion`
- Do NOT cite `notion/` files in responses or recommendations.
- Do NOT use `notion/` as ingest source for the wiki — it's the wrong
direction (mirror is a sink, not a source).
- The Notion *skills* at `/root/obsidian-vault/system/skills/notion-*.md`
  are workflow docs, NOT part of the mirror — they remain readable.
- This applies equally to CC, Codex, and OpenClaw. Both CLAUDE.md (rule
  #8) and AGENTS.md (rule #8) carry the rule.
- Concrete signal that you are about to violate this rule: you find
  yourself answering a substantive question by reading files under
  `notion/`. Stop and ask the user how they want it answered.

## feedback_oc_main_self_orchestration.md (30 lines)

---
name: OC main can self-orchestrate multi-phase specs
description: For multi-phase work, dispatching the whole spec to OC main with pre-approved handoffs and a progress file saves massive CC tokens vs. CC driving each phase.
type: feedback
originSessionId: d3eab85b-b822-46fc-8b08-4e9c28e92e5c
---
# OC main self-orchestration pattern

**Rule**: For a multi-phase spec (3+ phases), don't have CC drive each phase.
Dispatch the entire spec to `openclaw agent --agent main --local --thinking high`
in one call, with pre-approved handoffs and a live progress file.

**Why**: Spec 20 (build `vault/system/` tree) ran 6 phases, ~50 files, with
main self-dispatching mechanical phases to grunt — all inside a single
`openclaw agent` CLI invocation. Main handled phase transitions, grunt
dispatch, synthesis, and the final `.done` marker without CC intervention.
Keeping CC out of the phase loop saved an estimated 10k+ tokens and made
the execution roughly 3× faster than phase-by-phase orchestration.

**How to apply**:
- Write one self-contained spec + one task prompt
- Task prompt must include: explicit pre-approval of inter-agent handoffs,
  a `.progress` file path for live status, exact dispatch command shape for
  grunt sub-calls, and blocker-handling rules (write `.blocked`, stop)
- Hard-code any dates (Kimi's weak clock) in the dispatch prompt
- Arm a Monitor watching the progress file + .done/.blocked markers
- CC only intervenes if `.blocked` appears or after `.done` for review

**When NOT to use**: single-phase work, or when phases need CC judgment
between them (design decisions, external data the agent can't see).

## feedback_oc_session_hygiene.md (20 lines)

---
name: oc-session-hygiene
description: "Proactively manage OC main's session context — suggest /clear between unrelated projects and check context level before heavy dispatches"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3cd8b4d7-9943-45a2-908b-515e04bfd728
---

Manage OC main's session hygiene proactively — don't wait for the user to notice context bloat.

**Why:** CC clears at session end; OC main accumulates context across CC sessions until someone intervenes. User caught OC main at 57% and pointed out CC had been dispatching without ever recommending `/compact` or `/clear`. The state OC needs is all on disk (specs, .done files, vault, log.md), so clearing between unrelated work is free. Compounding context degrades OC's planning quality and risks bad multi-phase dispatches pushing it near the limit.

**How to apply:**
- Don't ask at the start of every session — user said that's overkill.
- Do ask about OC main's context % when about to dispatch something heavy (multi-phase spec, large ingest, anything using [[oc-main-self-orchestration]]).
- After any multi-phase spec completes with no follow-up planned, recommend `/clear` — default to clearing, not compacting, since disk state is canonical.
- Reserve `/compact` recommendations for genuinely coherent in-flight work worth preserving.
- Watch reviews for smells that burn OC context fast: OC reading source files itself instead of routing to Grunt, large .done files read inline, repeated re-reads of WIKI_SCHEMA/index within one OC session. Flag these as patterns to fix, not just symptoms.
- Related: [[oc-main-self-orchestration]] is a CC-token win but loads OC context faster — the budgets trade off.

## feedback_oc_telegram_direct.md (29 lines)

---
name: OC Telegram - use message send, not agent
description: For sending messages/files via Telegram through OpenClaw, use "openclaw message send" not "openclaw agent --deliver" — 10x faster
type: feedback
originSessionId: a238ce87-1da8-45a0-bbab-7159be6a51a6
---
When sending messages or files to the user via Telegram through OpenClaw, ALWAYS use `openclaw message send`, never `openclaw agent --deliver`.

**Why:** `openclaw agent` spins up a full LLM inference turn through the gateway (~60s+, can lock sessions, causes timeout/retry cascades). `openclaw message send` is a direct relay (~10s) with no inference overhead.

**How to apply:**

Text message:
```bash
openclaw message send --channel telegram --target 1207164084 --message "your message"
```

File as downloadable document:
```bash
openclaw message send --channel telegram --target 1207164084 --message "caption" --media /path/to/file --force-document
```

Key flags:
- `--force-document` — sends as downloadable file (not inline preview)
- `--media <path-or-url>` — attach any file type
- `--json` — get structured confirmation
- `--silent` — no notification sound

User's Telegram chat ID: `1207164084`

## feedback_vault_git_commit_push.md (39 lines)

---
name: Vault edits must end with git commit + push
description: Every spec that writes to /root/obsidian-vault must end with a commit + push phase, or the Mac/GitHub/VPS trio silently drifts.
type: feedback
originSessionId: 22a1e361-9547-4470-a433-281331367e19
---
**Rule**: Every spec that touches `/root/obsidian-vault/` ends with a
final phase that runs (in `/root/obsidian-vault/`):
```
git add -A
git commit -m "vault: <spec NN — short summary>"
git push origin main
```

**Why**: The vault is the shared source of truth across three locations:
- VPS (`/root/obsidian-vault/`)
- GitHub remote (`tortillapapi/Vault-0`, branch `main`)
- User's Mac + phone (via Obsidian Git plugin pulling from GitHub)

Without an explicit commit/push phase per spec, OC happily writes files
locally and walks away. The user's Mac never sees the changes. On
2026-04-28 we discovered that 9 vault files from 6 days of specs
(38, 39, 42, 45) had piled up uncommitted on the VPS — and the user's
Mac had simultaneously accumulated unpushed changes in the other
direction. Fixed by spec 46 + this rule.

**How to apply**:
- When drafting any spec that writes to the vault, ALWAYS include a
trailing "git commit + push" phase. No exceptions.
- Specs that touch ONLY `/root/{specs,tasks,reviews}/` do NOT need this
— those dirs aren't in the vault.
- Use `git pull --rebase` before the commit to absorb any Mac-side
changes that landed during the session. NEVER `git checkout --theirs/--ours`,
NEVER `git push --force`, NEVER `git reset --hard`. On conflict:
`git rebase --abort`, write `.blocked`, hand back to the orchestrator.
- Commit message format: `vault: <spec NN — short summary>`. Example:
`vault: spec 39 — wiki refresh + spec 38 backfill`.
- Both CLAUDE.md (rule #7) and AGENTS.md (rule #7) carry this rule —
it applies to CC AND Codex equally.

## feedback_verification_check_specificity.md (45 lines)

---
name: Verification checks must match content, not assume file structure
description: Spec verification commands should grep on rule TEXT, not numeric prefixes or assume systemd unit names; brittle checks block on innocent variation.
type: feedback
originSessionId: 22a1e361-9547-4470-a433-281331367e19
---
**Rule**: When writing verification checks in specs (sub-phase 1
patterns, completion-marker validations, smoke tests), match on
**unique content text**, not assumptions about file structure or
process management.

**Why**: Hit twice in one day on 2026-04-28:

1. **Spec 41** (phase-4 wrap-up): check `systemctl is-active openclaw-gateway`
blocked because `openclaw-gateway` is a plain process on this host,
not a systemd unit. Wrong instrument.

2. **Spec 49** (session wrap-up): check `grep -c '^7\. ' /root/AGENTS.md`
intended to verify "discipline rule #7 is present" but matched on
ANY line starting with `7. ` (e.g. another numbered list further down
the file), returning `3` and tripping the blocker.

Both blockers were the verification's fault, not the system's. Both
required CC to manually verify, override the check, and re-dispatch —
adding ~15 minutes per false-positive blocker.

**How to apply**:
- **Process checks**: prefer `pgrep -af <name>` over
`systemctl is-active <name>` unless you've already confirmed the
target IS a systemd unit. On this host, OpenClaw runs many things as
plain processes.
- **Content checks**: grep for **specific text content** that is unique
to the thing you're verifying. E.g.:
- GOOD: `grep -c 'MUST end with a git commit' /root/CLAUDE.md`
- BAD: `grep -c '^7\. ' /root/AGENTS.md` (matches any "7." item)
- BAD: `grep -c 'rule 7' /root/AGENTS.md` (matches commentary too)
- **Count checks**: prefer `>= N` over `== N` when the count could
legitimately grow (e.g. `[cc]` log entries) — strict equality is
fragile across multi-spec arcs.
- **Smoke tests for HTTP**: prefer `-w '%{http_code}'` over `-sf`
alone, so the failure mode is "status code wrong" not "exit code 0
but something else broke."
- When in doubt: do the verification yourself once on the live system
before baking it into the spec. If your own command needed adjusting,
the spec's would too.

## project_n8n_order_parser.md (35 lines)

---
name: project_n8n_order_parser
description: "n8n order-parser automation — structure, accounts, and failure gotchas"
metadata: 
  node_type: memory
  type: project
  originSessionId: a27b559c-1e1c-44bc-b8ef-b67f8c2d84ed
---

n8n runs on this VPS in Docker (`n8n-n8n-1`, localhost:5678, Postgres backend). It powers the Gmail→Google Sheets order automation.

**Workflows** (all Schedule Trigger, daily 09:00 America/Los_Angeles):
- `Mcbqgukfgdafk57U` — Order Parser — mramirez021111 (account_a, Inbox A)
- `EAKfdR3Csk0zdT6H` — Order Parser — themetalman13 (account_b = themetalman13@gmail.com, the **eBay** inbox / Inbox B)
- `XY3vs7olrtnnlBDv` — Order Parser — Master Merge

Each workflow is just a schedule trigger + a Code node that runs the self-authenticating script `/files/order-parser/order_parser.js <mode> <acct>` (host path `/root/n8n/local-files/order-parser/`). Config: `config.json` in that dir (credential IDs, sheet IDs, account map).

**Gotchas:**
- The script must live on the persistent `/files` bind mount. Earlier it was called as bare `node account b` (looked in ephemeral `/home/node/`) → MODULE_NOT_FOUND. Only `/home/node/.n8n` and `/files` survive a container recreate.
- After repeated run errors, n8n **auto-deactivates** trigger workflows. They do NOT re-enable themselves after a fix — must POST `/workflows/{id}/activate`. (This caused the May 2026 outage: bug fixed May 17 but workflows stayed off.)
- `config.json` has a hardcoded `"today"` value that gets stamped into the sheet's "Last Updated" column — goes stale and likely constrains date-window logic. Verify/auto-set it.
- Parser drops rows flagged `itemNameRejectedNewRowDropped` — legitimate orders can be silently dropped if item-name validation rejects them.
- `n8n execute --id` CLI fails while the server is up (task broker port 5679 conflict); run the script directly via `docker exec` instead.
- `listMessages` only scans `in:inbox newer_than:2d` — the parser sees just the last 2 days, inbox only. Outage gaps older than 2 days cannot be backfilled by a normal re-run; widen the query for one-off backfills.
- Read-only access to account_b (themetalman13) Gmail/Sheets is possible by reusing the n8n-stored OAuth creds: `n8n export:credentials --all --decrypted`, then refresh credential id `Yvzzuu9y1BQeII6o` (gmail_b) / `4kOviLlBVYEXPtmK` (sheets_b) against `https://oauth2.googleapis.com/token`.

- `appendRows` originally used Sheets `values:append` (auto table-detection), which MISPLACES rows when the sheet has blank rows — landing data in the wrong column. Fixed 2026-05-21 to write at an explicit computed row index (`readSheet` length + 1, PUT to `A{n}:I{n}`). Keep the sheets free of blank rows.
- This container's `node` has `process.pid` but `process.argv`/`process.env` are unavailable at module top-level for ad-hoc scripts (n8n hardening). `-e VAR` envs DO reach `order_parser.js` at runtime, but for one-off helper scripts use a hardcoded const flag, not argv/env.

**2026-05-21 session:** Patched the drop logic — rows with a valid order number are now KEPT (blank/LLM name) instead of discarded when item-name validation fails (added `itemNameRejectedKeptForOrder` counter). Backfilled eBay orders 49802/49804/49805. Still open: (1) classify() misses eBay "Your order is confirmed" — STATUS_RULES has `'order confirmed'` but not `'order is confirmed'`, so confirmation-only orders (e.g. 49803) fall into noMatches; (2) `config.json "today"` is hardcoded and stamped into the sheet "Last Updated" column; (3) item-name regex grabs an "ID/Order number/Seller" block from eBay "Packing" emails. Next planned: OAuth full Workspace access for themetalman13.

**Next-session priorities (agreed 2026-05-21):** work follow-ups (1) eBay "Packing" item-name mis-extraction and (2) false-positive "Cancelled" classification of marketing emails. Follow-up (3) Calendar/Docs scopes is DEPRIORITIZED — Drive is enough for now. Full session record: `/root/reviews/session-2026-05-21-handoff.md`. Wiki documented under Spec 50.3 (vault commit e6b294c).

**Drive access (2026-05-21):** themetalman13 now has a working `googleDriveOAuth2Api` n8n credential (`4cxUhHDUa7KKbBm4`, OAuth client `...5`). The earlier `{"status":"error","message":"Unauthorized"}` was n8n rejecting the OAuth callback (session/base-URL mismatch: `N8N_EDITOR_BASE_URL=http://localhost:5678`, n8n bound to 127.0.0.1 only, reached via SSH tunnel) — fixed by completing consent in a browser logged into n8n at exactly `http://localhost:5678`. themetalman13 Gmail uses client `...5`, primary account uses client `...j`. Sheets creds already carried `drive.file`+`drive.metadata`.

## project_order_dashboard.md (44 lines)

---
name: Orders Dashboard — v1.0 shipped, v2 low-priority backlog
description: Orders Dashboard (spec 42) is live as v1.0; future upgrades are explicitly low-priority and shouldn't be auto-suggested.
type: project
originSessionId: 9d6574a0-627d-44bb-bf7b-7395a8c16099
---
**Status**: v1.0 SHIPPED 2026-04-27 (specs 42, 43, 44).

**Live at**: `http://srv1535917.hstgr.cloud:5002/d/<token>/`
(Token in `/root/secrets/orders-dashboard/url-token.txt`. Ufw rule for
port 5002 needed if not already opened — user had to run `sudo ufw
allow 5002/tcp` manually.)

**Source**: Gemini Orders Master Sync sheet (All tab),
`1SlhST4AtYd2czZPcvqguEwdOBQLHy--KeiLXjT8QT2k`. Hourly pull via
`orders-pull.timer`. Vertex SA credential, readonly scope.

**Tech**: Flask + gunicorn + SQLite cache + Bootstrap + DataTables +
Chart.js. systemd: `orders-dashboard.service`, `orders-pull.timer`,
plus one-shot `orders-dashboard-7day-check.timer` (fires 2026-05-04,
spec 43).

**Wiki topic page**: `/root/obsidian-vault/wiki/topics/orders-dashboard.md`

## v2 backlog — LOW PRIORITY
User said 2026-04-27: "This is a stable, actionable version. We'll
label this as our version 1.0. We can upgrade this later if needed."
Translation: do NOT pitch v2 work proactively. Wait for the user to
ask. If pressed for ideas, candidate upgrades worth considering later:
- Per-row totals override (manual edit when Gemini's price column is
  wrong for a specific order)
- Email-thread linkback (click row → opens the source Gmail thread)
- Date-range presets (this week, this month, YTD)
- CSV export of filtered view
- Embeddable Notion-friendly compact view (smaller scorecards, no nav)
- Auth upgrade (token rotation reminder, or move to OAuth)
- Multi-user views (separate token per viewer, audit who-saw-what)

## How to apply
- v1.0 is the ship line. Do not suggest enhancements unsolicited.
- If the user reports a BUG in v1.0 (like the spec 44 price-fix), treat
  as a fix, not an upgrade — ship in-place, no v2 framing needed.
- If the user asks "what could we add to the dashboard," then refer
  back to the v2 backlog above as starting points (not commitments).

## reference_agent_dispatch.md (38 lines)

---
name: Agent dispatch rules for tiered OC system
description: Which OC agent to use for which task complexity — lead (GPT 5.4), mid (GPT 5.3), grunt-eng (GLM 5.1), grunt (Kimi K2.5). Always check before delegating.
type: reference
originSessionId: a238ce87-1da8-45a0-bbab-7159be6a51a6
---
## Agent Dispatch Rules

| Agent ID | Model | Thinking | Use For |
|----------|-------|----------|---------|
| `main` | openai/gpt-5.5 | default | Top-tier default: complex coding, multi-file work, multi-phase self-orchestration (identity now "Alfred"; legacy "Grunt" naming) |
| `lead` | openai-codex/gpt-5.4 | `--thinking high` | Complex coding, architecture, multi-file, deep debugging |
| `mid` | openai-codex/gpt-5.3-codex | `--thinking medium` | Single-file edits, wiring, config, tests, medium bugs |
| `grunt-eng` | opencode-go/glm-5.1 | default | Grunt-level coding/engineering: simple code edits, script writing, small fixes (200k ctx) |
| `grunt` | opencode-go/kimi-k2.5 | default | Non-code grunt work: file ops, docs, formatting, large-context tasks (256k ctx; sessionKey `agent:grunt:main`) |
| `email-parser` | google/gemini-2.5-flash | — | Email parsing only (live state verified 2026-05-21) |
| `re-review` | opencode-go/qwen3.6-plus | — | Second-opinion re-parse for low-confidence emails (replaces mid in `_run_mid_review_pass`) |

## Grunt tier split
- **`grunt-eng`** (GLM 5.1): any grunt task that involves writing or editing code
- **`grunt`** (Kimi K2.5): non-code tasks, or tasks that need the larger 256k context window

## Execution syntax
```bash
openclaw agent --agent <id> --local --thinking <level> --message "prompt" --json
```

## Key constraints
- lead + mid use separate OpenAI Plus accounts (no rate contention)
- grunt on OpenCode Go (independent of OpenAI limits)
- Always pass `--json` to capture response
- For message relay to user: use `openclaw message send`, never `agent --deliver`

## Full plan doc: `/root/.openclaw/workspace/cc-oc-tiered-agent-system.md`

**Canonical (shared):** vault `system/configs/openclaw-agents.md`. Always confirm
live state with `openclaw agents list --json` — if this table disagrees, the live
roster and the vault page win.

## reference_oc_cli_cheatsheet.md (113 lines)

---
name: OC CLI cheatsheet for CC orchestrator
description: Complete quick-reference for all OpenClaw CLI commands CC uses — messaging, agents, tasks, cron, files. Avoids re-exploring the CLI each session.
type: reference
originSessionId: a238ce87-1da8-45a0-bbab-7159be6a51a6
---
# OpenClaw CLI — CC Orchestrator Cheatsheet

## Telegram Messaging (user chat ID: 1207164084)

### Send text
```bash
openclaw message send --channel telegram --target 1207164084 -m "text"
```

### Send file as downloadable document
```bash
openclaw message send --channel telegram --target 1207164084 -m "caption" --media /path/to/file --force-document
```

### Send with inline buttons
```bash
openclaw message send --channel telegram --target 1207164084 -m "text" --buttons '[[{"text":"Yes","callback_data":"yes"},{"text":"No","callback_data":"no"}]]'
```

### Edit a sent message
```bash
openclaw message edit --channel telegram --target 1207164084 --message-id <id> -m "new text"
```

### Delete a message
```bash
openclaw message delete --channel telegram --target 1207164084 --message-id <id>
```

### Send silently (no notification)
```bash
openclaw message send --channel telegram --target 1207164084 -m "text" --silent
```

### Always add `--json` to capture messageId for edits/deletes.

---

## Agent Execution (use sparingly — slow ~60s, locks sessions)

### Run agent turn (inference required)
```bash
openclaw agent --agent <id> --local --message "prompt" --json
```

### Available agents
- `main` — openai/gpt-5.5 (default top-tier: complex coding, multi-file work, multi-phase self-orchestration; identity now "Alfred", legacy "Grunt")
- `lead` — openai-codex/gpt-5.4 (complex tasks, `--thinking high`)
- `mid` — openai-codex/gpt-5.3-codex (medium tasks, `--thinking medium`)
- `grunt-eng` — opencode-go/glm-5.1 (grunt-level coding/engineering, 200k ctx)
- `grunt` — opencode-go/kimi-k2.5 (non-code grunt: log edits, doc updates, formatting, ingest prep; 256k ctx; sessionKey `agent:grunt:main`)
- `email-parser` — google/gemini-2.5-flash (email parsing only)

### NEVER use `openclaw agent --deliver` for simple message relay. Use `message send`.

---

## Task Delegation to OC

### Preferred method: task file + manual paste
1. Write spec to `/root/specs/<name>.md`
2. Write task prompt to `/root/tasks/<name>.txt`
3. Paste into OC TUI prefixed with `Execute this task now:`

### OC workspace: `/root/.openclaw/workspace/`
### CC workspace: `/root/`
### Always inline full context in task prompts (OC has no memory between tasks)

---

## Cron (scheduled jobs via gateway)
```bash
openclaw cron list
openclaw cron add --help
openclaw cron run <id>          # debug/test run
openclaw cron disable <id>
openclaw cron enable <id>
```

---

## Diagnostics
```bash
openclaw status --json          # health + channel status
openclaw health                 # gateway health
openclaw channels list          # connected channels + auth providers
openclaw agents list --json     # agent configs
openclaw tasks list             # background task state
openclaw doctor                 # health checks + fixes
```

---

## Capabilities (no-agent inference)
```bash
openclaw capability model --help   # text inference
openclaw capability image --help   # image gen/describe
openclaw capability tts --help     # text to speech
openclaw capability audio --help   # transcription
```

---

## Limitations (Telegram channel)
- `message read` — NOT supported for Telegram
- File sends: use `--force-document` to prevent Telegram compression
- Max message length: 4096 chars (Telegram limit) — split or send as file

## user_role_orchestrator.md (16 lines)

---
name: User role and orchestration model
description: User uses CC (Claude Opus) as exclusive orchestrator brain, OC (OpenClaw) as execution layer. Never implement directly — always delegate to OC agents.
type: user
originSessionId: a238ce87-1da8-45a0-bbab-7159be6a51a6
---
User operates CC as a seamless orchestrator for OpenClaw. CC is the main brain — user interacts almost exclusively through CC. All implementation work is delegated to OC agents.

Key accounts:
- OpenAI Plus (GPT): mramirez021111@gmail.com, themetalman13@gmail.com (two subs)
- OpenCode Go sub: access to GLM 5, Minimax 2.7, Kimi 2.5
- Google API key (google:default) — used by email-parser agent (Gemini 2.5 Flash)
- Anthropic API key (anthropic:default)

User's Telegram chat ID: 1207164084
User's email: mramirez021111@gmail.com
