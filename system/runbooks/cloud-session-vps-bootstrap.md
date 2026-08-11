---
type: system-runbook
title: Cloud Session → VPS Access Bootstrap
slug: cloud-session-vps-bootstrap
canonical_for: [cloud-session-vps-access]
created: 2026-08-11
maintainer: cc
status: not-yet-executed
tags: [ops, runbook, infra, ssh, cloud-session]
---

# Cloud Session → VPS Access Bootstrap

**You are reading this because Papi pointed a brand-new Claude Code cloud session at
this repo and asked it to gain the same VPS capability the local Mac session and the VPS
tmux session already have.** You have zero context beyond what's in this file and what
you read from the vault as you go. That's by design — read on demand, don't assume.

## What this is, and why it exists

Papi currently drives this box three ways:
- **A tmux session on the VPS** (`ssh vps` then `claude`), reachable from any device by
  attaching to the same pane.
- **A local Claude Code session on his MacBook**, which reaches the VPS over SSH for
  everything the vault-via-git path can't cover.
- **Metis**, a Telegram-driven CC gateway with a per-tool-call approval gate. Works, but
  approves one tool call at a time, which is slow for real work. It costs ~35 MB RSS on a
  box with several GB free — retiring it later is a UX decision, not a resource one, and
  should only happen after this path is proven, not before.

He wants a **cloud session** (reachable from any device, same chat, no tmux needed) with
the same practical capability as the Mac/tmux sessions. That means SSH to the VPS —
cloning `/root` into GitHub was considered and rejected. The reasoning, in case you need
to explain it back: most of what makes VPS work useful is **live state**, not files —
`systemctl`, `journalctl`, `openclaw agents list --json`, `hermes cron list`, targeted
`sqlite3` queries. A git mirror of `/root` would give you a stale copy of *some* of that
and none of the rest, while inviting you to trust it. SSH gives you the real thing.

## The two access paths — use both, for different things

| Path | Covers | How |
|---|---|---|
| **git** (already working) | `/root/obsidian-vault` → `tortillapapi/Vault-0`; `/root/command-center` → `tortillapapi/command-center` | Clone/pull/edit/commit/push directly against GitHub. You're already pointed at the vault. |
| **SSH** (this runbook sets it up) | `/root/specs`, `/root/tasks`, `/root/reviews`, `/root/scripts`, `/root/bin`, `systemctl`, `journalctl`, `openclaw`, `hermes`, targeted sqlite reads | New in this session. |

Do not edit vault files by SSHing into the VPS's clone and forgetting to push — same
discipline any peer follows. The VPS clone auto-pulls from GitHub hourly
(`vault-pull.timer`); it is not where you should make edits.

**`/root/scripts` is a special case**: it has a local git repo with **no remote** (see
`system/cheatsheets/operating-rules.md`'s note on this — the repo also has 24
uncommitted files as of 2026-08-11, so don't trust `git checkout` there). You can `git
log`/`git diff` it over SSH; you cannot `git clone` it, because there's nowhere to clone
from. If Papi has since given it a remote, this section may be stale — check.

## Phase 0 — confirm your sandbox can reach the VPS at all

No credentials needed for this. It's a reachability probe, not a login attempt:

```bash
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new root@srv1535917.hstgr.cloud exit
```

Read the result:

- **`Permission denied (publickey).`** within a few seconds → **good.** Your sandbox
  reached the box, SSH negotiated, and it correctly rejected you because no key is
  authorized yet. Proceed to Phase 1.
- **Hangs, or `Operation timed out`** → your sandbox's egress to this host/port is
  blocked. Stop. Report this back to Papi rather than retrying — this whole plan needs a
  different approach if outbound SSH isn't permitted.
- **`Connection refused`** → something's rejecting at the network layer before SSH even
  starts. Also stop and report.

If the hostname doesn't resolve for some reason, the VPS's IP is `187.124.88.165` — same
test applies with the IP in place of the hostname.

## Phase 1 — the account model (Papi decides — do not default silently)

Ask him which tier, if he hasn't already said. Present it plainly:

**Tier A — dedicated user, full `NOPASSWD` sudo (recommended default).**
New user (suggested name: `cloud-cc`), SSH-key-only, in a sudoers rule granting
everything with no password. This is functionally root-equivalent — same capability the
existing `ubuntu` user already has on this box — but it is a **separate, revocable
credential**. If a sandbox key ever leaks, Papi runs one command
(`userdel --remove-home cloud-cc` or `usermod -L cloud-cc`) and it's dead, without
touching the root key used by every other session. That is the entire value of not
just using the root key directly: same power, independent kill switch.

**Tier B — scoped least-privilege.** ACLs on specific `/root` subpaths plus a narrow
sudoers allowlist (`systemctl status/list-timers`, `journalctl -u`, `openclaw *`,
`hermes *`, scoped `git -C`). Sketched here, not built: `/root` is `700 root:root`, and a
lot of genuinely useful work (`systemctl`, `journalctl -u` on root units, the `openclaw`
and `hermes` CLIs reading `/root`-scoped config) wants real privilege, not just file
access. Getting an allowlist that doesn't block ordinary work takes iterative tuning —
expect friction the first week if you build this instead. **Recommendation: start with
Tier A, revisit Tier B later only if Tier A proves out and Papi wants to harden it.**

## Phase 2 — VPS-side account creation (needs a session that already has root)

**You cannot do this step yourself the first time — it's a chicken-and-egg problem.**
Ask Papi to run this from a session that already has VPS access (the Mac session, the
tmux session, or by pasting it to either).

```bash
ssh vps 'useradd -m -s /bin/bash cloud-cc
mkdir -p /home/cloud-cc/.ssh
chmod 700 /home/cloud-cc/.ssh
chown cloud-cc:cloud-cc /home/cloud-cc/.ssh
echo "cloud-cc ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/cloud-cc
chmod 440 /etc/sudoers.d/cloud-cc
visudo -c'
```

`visudo -c` at the end validates the sudoers syntax before it goes live — don't skip it.
The account exists now but has no way to log in yet; that's Phase 3 and the second half
of this phase.

## Phase 3 — generate your own keypair (the private half never leaves your sandbox)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/vps_cloud_cc -N "" -C "cloud-session-$(date -u +%Y%m%d)"
cat ~/.ssh/vps_cloud_cc.pub
```

Print that public key in chat. Public keys are not secret — safe to paste anywhere.
**Never do this with the private key file.** Papi (or whoever ran Phase 2) relays the
public key back and appends it:

```bash
ssh vps 'echo "<PASTE THE PUBLIC KEY HERE>" >> /home/cloud-cc/.ssh/authorized_keys
chmod 600 /home/cloud-cc/.ssh/authorized_keys
chown cloud-cc:cloud-cc /home/cloud-cc/.ssh/authorized_keys'
```

## Phase 4 — connect and verify

```bash
cat >> ~/.ssh/config <<'EOF'
Host vps
  HostName srv1535917.hstgr.cloud
  User cloud-cc
  IdentityFile ~/.ssh/vps_cloud_cc
  StrictHostKeyChecking accept-new
EOF
chmod 600 ~/.ssh/config

ssh vps 'whoami && sudo whoami && hostname'
```

Expect `cloud-cc` / `root` / `srv1535917`. If `sudo whoami` fails, the sudoers file
wasn't installed correctly — go back to Phase 2 and check `/etc/sudoers.d/cloud-cc`.

## Phase 5 — orient yourself as CC on this box

You're now the same **`cc`** identity as every other Claude Code session here — just
running from Anthropic's cloud instead of a Mac or a tmux pane. Don't re-derive the
rules; read them, same as any fresh CC session would:

```bash
ssh vps 'cat /root/CLAUDE.md'
ssh vps 'cd /root/obsidian-vault && git pull --rebase 2>&1 | tail -3'
```

Then, at minimum:
- `system/cheatsheets/operating-rules.md` — standing rules, canonical for every agent.
- `system/configs/openclaw-agents.md` — roster and tier routing.
- `system/workflows/peer-orchestrator-protocol.md` — the shared spec/task/review
  contract: `owner:` values, log tags, completion markers, anti-collision.
- `system/decisions/2026-08-orchestration-authority-model.md` — why the precedence rule
  (*live runtime > vault `system/` > `/root` files*) exists, and what it replaced.

Tag any `log.md` entries, specs, or reviews you write `[cc]` / `owner: cc` — same as
every other CC surface. There is no separate `owner:` value for "CC running in the
cloud"; it's the same peer, a different launch environment.

## Constraints carried over — don't relearn these the hard way

- `/root` configs (`CLAUDE.md`, `AGENTS.md`, `.hermes.md`, `ORCHESTRATOR.md`, `scripts/`,
  `bin/`, `.hermes/`) are **not git-versioned** (scripts/ has a git repo but no remote —
  still back up before editing). Dated `.bak` before any hand-edit, always.
- Never restart `metis-gateway.service` or `hermes-gateway.service` from inside a session
  running through that same gateway. Not directly applicable to you, but the general
  rule stands: check a unit isn't in your own execution's ancestry before restarting it.
- `.hermes/`, `.claude/`, `.openclaw/` are private per-harness state under the peer
  protocol. Read only for a specific, approved reason (there is exactly one standing
  carve-out, documented in the protocol) — don't casually explore them.
- sqlite DBs (`state.db`, `kanban.db`, `verification_evidence.db`, `bridge.db`) — query
  specific rows with `sqlite3`, never dump or `cat` a whole DB into context. Some are
  hundreds of MB.
- Standard Claude Code tool-approval prompting applies to you exactly as it does to any
  other session — this runbook doesn't grant you anything beyond what your own harness
  permissions allow. Destructive or high-blast-radius commands should still prompt.

## Open decisions for Papi

Resolve these before or during first real use — don't guess on his behalf:

1. **Tier A vs Tier B** (Phase 1). This runbook assumes A.
2. **Username** — `cloud-cc` is a placeholder suggestion, not a requirement.
3. **`PermitRootLogin`** is currently `yes` on the box. Now that a non-root path exists,
   tightening it is a real option — but it's a separate, deliberate security change
   with its own blast radius (it would affect every other session using the root key,
   including the tmux session and Metis's assumptions). Don't bundle it into this
   bootstrap; raise it as its own decision once this path is proven.
4. **Retiring Metis** — not resource-motivated (it costs ~35 MB RSS on a box with several
   GB free). Purely a UX call, and only after this path has run trouble-free for a
   while.
5. **Giving `/root/scripts` a GitHub remote** — a real fix for the "no remote, no rollback
   beyond `.bak`" trap documented in `operating-rules.md`, and it would let a future cloud
   session reach it via git too. Independent of this bootstrap; tracked separately. Gate:
   15 of 35 scripts there match secret-ish grep patterns, so run
   `/root/scripts/secret-scan.sh` before any push.

## Status of this runbook

**Not yet executed as of 2026-08-11.** No VPS-side account exists yet. Phase 0 has not
been run from an actual cloud sandbox — the reachability question is genuinely open.
Update this file's `status:` frontmatter once Phase 4 passes, and note whichever
username and tier were actually chosen so the next reader doesn't have to guess.
