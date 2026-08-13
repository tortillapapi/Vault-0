# Runbook: n8n Order-Parser Daily Accuracy Audit

**Run by:** Hermes (`hermesparser` profile) via systemd timer `hermes-parser-audit.timer`, schedule `09:20 America/Los_Angeles`, daily.
**Self-contained** — the agent has no memory between runs; everything needed is here.
**Active window:** ongoing watchdog — runs until the parser is verified stable, then retire manually (no auto-expiry).

## Execution rules (MANDATORY — read before running anything)
- NEVER use `set -e` / `set -euo pipefail` anywhere in this run.
- Every shell probe MUST end with `|| true` so one failure cannot abort the audit.
- If any step fails, RECORD it as a finding (in the log + alert) and CONTINUE to
  the next section. The audit must always reach the "write log" + "alert" steps.
- Do NOT improvise credential reads, remediation shell, or jq paths. Use ONLY the
  exact commands written in this runbook.
- This run DIAGNOSES and REPORTS only. It NEVER remediates (no re-auth, no
  re-activate, no container restart, no editing config). Remediation is a
  separate orchestrator task.

## 1. Did the parser run? (systemd execution status)
```
/root/scripts/parser-run-status.sh || true
systemctl show order-parser.service -p Result -p ExecMainStatus -p ActiveState || true
TODAY_PT=$(TZ=America/Los_Angeles date +%F)
SINCE_UTC=$(date -u -d "TZ=\"America/Los_Angeles\" $TODAY_PT 00:00:00" +'%F %T' 2>/dev/null || date -u +'%F 00:00:00')
journalctl -u order-parser.service --since "$SINCE_UTC" --no-pager || true
```
Parser execution now runs via the systemd timer `order-parser.timer` at 09:00
America/Los_Angeles. The n8n parser workflows are intentionally disabled and
must not be treated as inactive-run failures.

Pass criteria: `Result=success`, `ExecMainStatus=0`, `ran_today_pt=true`, and
each account (`account_a`, `account_b`, `master`) has `START` -> `END` with no
`FAILED` in the service journal. For any parser systemd failure, missed run, or
account failure, capture the helper output / journal lines verbatim and record
it in the log + alert. Do NOT run any remediation or credential shell here —
name the likely cause in one line by reference to the `n8n-parser-triage` skill,
but DIAGNOSE ONLY. Fixing is a separate orchestrator task.

## 2. Recall — were any real orders MISSED? (independent of the parser)
Run the credential block exactly as written; do not improvise jq paths.
```bash
# Read order-parser credential IDs (tolerant; never aborts the run)
CONFIG_PATH="$HOME/n8n/local-files/order-parser/config.json"
gmail_a=$(jq -r '.credentials.gmail_a // empty' "$CONFIG_PATH" 2>/dev/null || true)
gmail_b=$(jq -r '.credentials.gmail_b // empty' "$CONFIG_PATH" 2>/dev/null || true)
sheets_a=$(jq -r '.credentials.sheets_a // empty' "$CONFIG_PATH" 2>/dev/null || true)
sheets_b=$(jq -r '.credentials.sheets_b // empty' "$CONFIG_PATH" 2>/dev/null || true)
```

For each account (`account_a`, `account_b`):
1. List the day's inbox candidates, **pre-filtered to honor the parser's own exclusion
   logic** (single source of truth: `order_parser.js` → `isExcluded` / `retailerExcluded`):
   `/root/scripts/gmail-orders-list.sh <account> 'in:inbox newer_than:1d' --json --exclude-parser-rejects`
   This drops emails the parser would exclude (J.Crew, Abercrombie, Panda Express,
   Capital One Shopping, Pokemon Center marketing, food delivery, etc.) — the filter
   uses the actual parser module exports, not a duplicated list. It also checks the
   subject and Gmail snippet so carrier or payment notifications that identify an
   excluded retailer outside the sender address (for example, FedEx shipping from
   Abercrombie) are excluded.
2. **Judge independently** which remaining messages are genuine order events (order
   confirmation / shipped / delivered / cancelled-with-order#). EXCLUDE
   newsletters, marketing, and price-drop alerts that passed the automatic filter.
   Emails the `--exclude-parser-rejects` flag dropped are NOT recall misses — they
   were intentionally excluded by the parser and you must NOT second-guess them.
3. Read what landed in that account's sheet: `/root/scripts/sheets-read.sh <account> 'A:I' --json`
   (master uses `sheets-read.sh master 'A:I'`). Full-column `A:I` is the valid range syntax.
4. For each judged order, check a matching row exists (match on order-number
   last-4, else retailer + date). Anything with an order email but **no sheet row = a MISS.**

## 3. Precision — is everything in the sheet actually an order?
The sheet has two different date columns:

| Column | Meaning |
|---|---|
| `Date of Email` | when the order email arrived |
| `Last Updated` | when the parser last **touched** the row |

`Last Updated` refreshes on any status change (→ Shipped, → Delivered), when a
tracking number lands, and on the nightly Master rebuild (clear + rewrite). It is
NOT a signal of when the row's order email arrived, so precision candidates are
selected by `Date of Email` — the same lookback window step 2 uses (currently
`newer_than:1d`). `Date of Email` is column F, already inside the `A:I` sheet read;
`Last Updated` is column J, outside it.

1. From the sheet read, take rows whose `Date of Email` falls inside the same
   lookback window step 2 uses. Those rows are confirmable, because the originating
   email is in hand.
2. Confirm each in-window row traces to a real order email from step 2's list. A row
   that maps to a newsletter / shipping-only noise / has a junk order number = a
   **FALSE POSITIVE.**
3. A row whose `Date of Email` predates the lookback window is **NOT EVALUABLE** —
   count it and report it separately. It is never a false positive and never counts
   against precision. Not-evaluable rows alone → `Verdict: OK`.

## 4. Write the log (PII-redacted — this file is pushed to GitHub)
Append to `/root/obsidian-vault/system/logs/n8n-parser-daily-check.md`
(create dir + file with an `# n8n Parser Daily Audit Log` header if missing):
Always append the new block at EOF. Do not insert by date or rewrite existing
entries; prior agents have split older entries by trying to place dates in order.
```
## <YYYY-MM-DD>
- Workflows: account_a=<status> | account_b=<status> | master=<status>
- Recall: <N> order emails | <M> matched | MISSES: <list or "none">
- Precision: <R> in-window rows | <C> confirmed | <N> not evaluable (email outside window) | FALSE POSITIVES: <list or "none">
- Verdict: OK | ANOMALIES
```
**Verdict rule:** `ANOMALIES` only when there is a real workflow error, a real recall
MISS, or a real in-window FALSE POSITIVE. Not-evaluable rows alone → `Verdict: OK`.
**Redact all PII**: order/tracking numbers → last-4 only (e.g. `…4471`); identify
misses/false-positives by retailer + order-last4 + date, never full numbers or
customer data.

## 5. Alert on ANY anomaly (Telegram)
If any workflow `error`, OR any MISS, OR any in-window FALSE POSITIVE (not-evaluable
rows alone do NOT alert), send one human-readable alert. Do not send a generic
one-line anomaly message or expose raw pipe-delimited counters without explaining
the impact.

Use this bounded format:
```
📦 Order parser audit — <date>
Status: REVIEW NEEDED
What happened:
• Pipeline: <✅ all three workflows completed | ⚠️ name the failed workflow>
• Orders checked: <N> likely order emails; <M> matched to sheet rows.
• Issue: <retailer + date + order-last4 when available; say "order number unavailable" when not>
Why it matters: <missed order, likely duplicate notification, parser false positive, or pipeline failure>
Next step: <one specific action for Papi>
Details: /root/obsidian-vault/system/logs/n8n-parser-daily-check.md
```
Keep it under 1,500 characters, redact full order/tracking numbers to last-4 only,
and omit clean sections. If evidence is ambiguous, say "needs confirmation" rather
than asserting a miss. If everything is clean, do not send a message (log only).

## 6. Commit the log to the vault (rule #6)
```
cd /root/obsidian-vault && git add -A && git commit -m "n8n parser daily audit <date>" && git pull --rebase && git push
```
Never force-push. If push conflicts, resolve via rebase; if it still fails, send
a Telegram note rather than leaving the log uncommitted.
