# Runbook: n8n Order-Parser Daily Accuracy Audit

**Run by:** OC `lead` agent via cron `parser-daily-audit`, daily 16:30 UTC.
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
1. List the day's inbox candidates: `/root/scripts/gmail-orders-list.sh <account> 'in:inbox newer_than:1d' --json`
2. **Judge independently** which messages are genuine order events (order
   confirmation / shipped / delivered / cancelled-with-order#). EXCLUDE
   newsletters, marketing, price-drop alerts, food delivery, and the parser's
   hard-excluded retailers. Use your own judgment — do NOT assume the parser was right.
3. Read what landed in that account's sheet: `/root/scripts/sheets-read.sh <account> 'A:I' --json`
   (master uses `sheets-read.sh master 'A:I'`). Full-column `A:I` is the valid range syntax.
4. For each judged order, check a matching row exists (match on order-number
   last-4, else retailer + date). Anything with an order email but **no sheet row = a MISS.**

## 3. Precision — is everything in the sheet actually an order?
1. From the sheet read, take rows whose `Last Updated` is within ~24h.
2. Confirm each traces to a real order email from step 2's list. A row that maps
   to a newsletter / shipping-only noise / has a junk order number = a **FALSE POSITIVE.**

## 4. Write the log (PII-redacted — this file is pushed to GitHub)
Append to `/root/obsidian-vault/system/logs/n8n-parser-daily-check.md`
(create dir + file with an `# n8n Parser Daily Audit Log` header if missing):
```
## <YYYY-MM-DD>
- Workflows: account_a=<status> | account_b=<status> | master=<status>
- Recall: <N> order emails | <M> matched | MISSES: <list or "none">
- Precision: <R> recent rows | <C> confirmed | FALSE POSITIVES: <list or "none">
- Verdict: OK | ANOMALIES
```
**Redact all PII**: order/tracking numbers → last-4 only (e.g. `…4471`); identify
misses/false-positives by retailer + order-last4 + date, never full numbers or
customer data.

## 5. Alert on ANY anomaly (Telegram)
If any workflow `error`, OR any MISS, OR any FALSE POSITIVE:
```
openclaw message send --channel telegram --target 1207164084 -m "n8n parser audit <date> — ANOMALY: <one-line summary>. See system/logs/n8n-parser-daily-check.md"
```
If everything is clean, do NOT send a message (log only).

## 6. Commit the log to the vault (rule #6)
```
cd /root/obsidian-vault && git add -A && git commit -m "n8n parser daily audit <date>" && git pull --rebase && git push
```
Never force-push. If push conflicts, resolve via rebase; if it still fails, send
a Telegram note rather than leaving the log uncommitted.
