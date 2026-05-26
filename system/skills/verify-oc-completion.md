# verify-oc-completion

Mirror of the CC orchestrator skill `verify-oc-completion` (canonical:
`/root/.claude/skills/verify-oc-completion.md`).

Use when OpenClaw reports a spec/task done and you need to confirm it's ACTUALLY
done. Generates a PASS/PARTIAL/FAIL verdict and **verifies every claim against
ground truth** — `stat`/`git log` for files, content `grep` for criteria,
derived timestamps (never the `.done` field — Kimi gotcha), `git log
origin/main..HEAD` to confirm vault work was pushed not just committed, and live
Sheet/workflow/dashboard checks for observable effects. A `.done` marker is a
claim, not evidence. Sibling of [[review-oc-work]] (which reviews quality
assuming the claim is true). Output: `reviews/<NN-name>-verification.md`.

See [[n8n-parser-triage]] and [[dashboard-healthcheck]] for the live-effect
cross-checks.
