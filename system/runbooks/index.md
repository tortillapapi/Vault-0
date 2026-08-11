# Runbooks Index

Step-by-step operational procedures — the "how to do the thing," as opposed to
`workflows/` (standing process) or `decisions/` (why something is the way it is).

- [[runbooks/cloud-session-vps-bootstrap|cloud-session-vps-bootstrap]] — set up SSH access
  from a Claude Code cloud session to the VPS. **Blocked at Phase 0 (2026-08-11): a
  standard cloud session's egress cannot reach raw TCP/SSH at all — proxied,
  domain-allowlisted HTTP/HTTPS only.** Read before assuming a cloud session can act on
  the VPS; it can only reach this git-versioned vault.
- [[runbooks/n8n-parser-daily-audit|n8n-parser-daily-audit]] — the n8n order-parser daily
  accuracy audit, retired/superseded by `hermes-parser-audit.timer` (kept for reference).
- [[runbooks/hermes-loop-guardrails|hermes-loop-guardrails]] — layered guardrails against
  runaway/over-engineered Hermes turns.
- [[runbooks/hermes-token-efficiency-and-openclaw-transition|hermes-token-efficiency-and-openclaw-transition]]
  — token-efficiency conventions and the OpenClaw transition history.
