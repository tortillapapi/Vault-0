---
type: system-decision
title: Orchestration Authority Model
slug: 2026-08-orchestration-authority-model
canonical_for: [doc-precedence, orchestration-authority]
decided: 2026-08-10
closed: 2026-08-11
maintainer: cc
tags: [ops, decision, orchestration, governance]
---

# Decision — Orchestration Authority Model (2026-08)

## Context

The orchestration/agent-routing layer grew from one orchestrator to four peers plus two
gateways with no reconciliation pass. These files are not documentation — they are
**executable policy**: every agent loads some subset at session start and behaves
accordingly. A contradiction between two of them means two agents do the same job
differently and neither is wrong.

A full audit ran 2026-08-10/11 across the native guidance files, vault governance, all
three skill trees, harness runtime config, and live state. It produced 13 drift classes.
Representative findings:

- `workflows/orchestrator-role.md` carried retired doctrine ("CC never implements",
  "use Lead for deeper synthesis") while listed in `core-index.md`'s always-load section.
- Three-way disagreement on `lead`'s thinking level; live config said **xhigh**, two docs
  said `high` — including the designated roster page and `.hermes.md`, read by the agent
  that owns ~70% of specs.
- Live skills routed routine work to `lead` ("Always route lint to Lead") and named three
  generations of dead models.
- The peer protocol contradicted ~85% of practice: `REVIEWER: cc | codex` versus actual
  `hermes`×21 / `re-review`×19 / `mid`×11; no `owner: metis` despite 12 metis-owned specs.
- The vault's canonical roster page declared `derived_from:` an agent's **private memory
  cache** — which contradicted it. Authority was inverted.

## Decision

**Precedence, one line:** *live runtime beats vault `system/`; vault `system/` beats any
`/root` file; skills and per-harness files point rather than restate — and if a doc names
a model or tier, run the CLI before trusting it.*

Four layers, one owner per fact:

| Layer | Holds | Rule |
|---|---|---|
| **L0 — Runtime** | `openclaw agents list --json`, `openclaw.json`, `systemctl` (system + `--user`), `hermes cron list` | Never document what a command can answer. Document the command. |
| **L1 — Vault `system/`** | Shared policy, git-versioned, one canonical page per concern | Roster+routing → `configs/openclaw-agents.md`; shared conventions → `workflows/peer-orchestrator-protocol.md`; standing rules → `cheatsheets/operating-rules.md`; syntax → `cheatsheets/oc-cli.md`; resume → `workflows/session-resume-protocol.md` |
| **L2 — Per-harness `/root`** | Identity, posture, load order, harness-specific quirks | Pointers, not restatements. `.hermes.md` keeps more inline because Hermes loads only that file — every such block is tagged `→ canonical:` |
| **L3 — Skills** | Procedures | Route by tier *name* only. Never name a model or thinking level. |

**`derived_from:` is retired.** Nearly every instance pointed at a file version that no
longer existed, and several inverted authority. Replaced by `canonical_for:` (this page is
the source of truth for X) and `canonical:` (this page defers to that one). Decision
records keep provenance under `sources_at_time:`, explicitly labelled as not an authority
pointer.

## Why this shape

The failure mode being eliminated is **the correct copy**. A wrong copy gets caught. A
copy that is correct today drifts silently later, and the more authoritative it looks the
longer the drift survives — `lead`'s thinking level was correct in four places and wrong in
two, and the wrong two were the roster page and the primary orchestrator's own file.

So the rule is not "keep the copies in sync." It is "have one copy," and where a second
copy is genuinely necessary (Hermes cannot read the other files), tag it with its
canonical source so drift is detectable rather than invisible.

## Consequences

Behavioral changes, deliberately made:

- Wiki lint, synthesis, and gap-finding route to **`mid`**, not `lead`.
- Reviews carry `REVIEW_TYPE: orchestrator | executor-qa`; only a peer's `orchestrator`
  ACCEPT closes a spec. Executor QA informs, never substitutes.
- `owner: metis` is legal; Metis is a **surface of CC**, not a fourth peer.
- CC memory follows the agent across launch directories (symlink).
- Codex keeps a deliberately smaller skill set — it no longer dispatches.

Structural results: `tier-routing.md` merged into the roster page; `orchestrator-role.md`
tombstoned; `system/governance/` deleted (a hand-maintained audit of hand-maintained files,
two months stale and wrong on every line count); the four `/root` guidance files reduced to
identity + pointers; dead models purged from 9 skills; the last duplicate roster removed
from `oc-cli.md`.

## Scope note — what the audit did not cover, and what that surfaced

The scan was scoped to the **orchestrator tier**. Three adjacent surfaces were opened
afterward, on 2026-08-11, and were not clean:

- **Hermes sub-profiles** were undocumented — three of six existed nowhere in `system/`.
  `hermesparser` describes itself as having "no schedule or production role yet" while a
  daily timer drives it against real order data. See [[system/configs/hermes-profiles]].
- **OC executor persona files** (`SOUL.md`, `IDENTITY.md`, `TOOLS.md`, dated April 9) were
  never audited. `IDENTITY.md` shadows every per-agent identity, so all six agents report
  as "Alfred 🔧" regardless of tier.
- **CC's memory store** held the last surviving copy of the retired doctrine
  (`user_role_orchestrator.md`: CC is the "exclusive orchestrator brain" that must "never
  implement directly").

The lesson worth carrying: *a doc surface absent from the register is not evidence it is
clean — it may only be evidence nobody read it.* The governance mirror that used to track
the OC persona files was itself deleted as stale, which is precisely how those files became
invisible.

## Record

- **Spec 226** — the consolidation (`/root/specs/226-orchestration-layer-consolidation.md`)
- **Spec 227** — resume-collector generalization + rotation/watchdog reconciliation, owned
  and executed by Hermes
- Vault log entries: 2026-08-10 (226), 2026-08-11 (226 follow-up, post-scan closeout, 227)
