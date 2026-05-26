# Runbook: n8n Order-Parser Daily Accuracy Audit

**Run by:** OC `lead` agent via cron `n8n-parser-daily-audit`, daily 16:30 UTC.
**Self-contained** — the agent has no memory between runs; everything needed is here.
**Active window:** 2026-05-26 → 2026-06-01 inclusive, then self-expire.

## 0. Self-expiry guard (do this FIRST)
Get today's UTC date: `date -u +%F`. If it is **after 2026-06-01**, disable this
job and exit immediately:
```
openclaw cron list --json | jq -r '.[]|select(.name=="n8n-parser-daily-audit")|.id' | xargs -r -I{} openclaw cron disable {}
```
Otherwise continue.

## 1. Did the workflows run? (execution status)
```
KEY=$(cat /root/secrets/n8n/api-key.txt)
for wf in "Mcbqgukfgdafk57U:account_a" "EAKfdR3Csk0zdT6H:account_b" "XY3vs7olrtnnlBDv:master"; do
  id="${wf%%:*}"; label="${wf##*:}"
  curl -s -H "X-N8N-API-KEY: $KEY" "http://127.0.0.1:5678/api/v1/executions?workflowId=$id&limit=1&includeData=false" \
   | jq -r --arg l "$label" '.data[0]|"\($l)\t\(.startedAt)\t\(.status)"'
done
```
For any `status=error`, pull the message (`includeData=true`, `.data.resultData.error.message`)
and consult the `n8n-parser-triage` skill (`/root/.claude/skills/n8n-parser-triage.md`)
for likely cause (credential expiry is the usual one).

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
