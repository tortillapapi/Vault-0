# n8n Parser Daily Audit Log

## 2026-05-26 (manual validation run, ~06:40 UTC — chain test)
> NOTE: `workflows=error` here reflects yesterday's pre-fix scheduled run; today's
> 16:00 UTC run had not fired yet at test time. The scheduled 16:30 UTC run records
> the authoritative status. This entry confirms the audit chain works end-to-end.
- Workflows: account_a=error | account_b=error | master=error
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 13 recent rows | 12 confirmed | FALSE POSITIVES: UPS …8250 2026-05-18
- Verdict: ANOMALIES

## 2026-05-26 (cron 07:52 UTC)
- Workflows: account_a=error | account_b=error | master=error
- Recall: 1 order email | 0 matched | MISSES: Ashburn Proxies 2026-05-26 (order-last4 unavailable; auth token redacted)
- Precision: 13 recent rows | 12 confirmed | FALSE POSITIVES: UPS …8250 2026-05-18
- Triage: latest errors all failed at `n8n export:credentials`; workflows are active, healthz OK, direct credential export and sheet-read probes now pass, so the failure is not currently reproducible as a Sheets OAuth read failure.
- Verdict: ANOMALIES

## 2026-05-26 (cron 16:30 UTC)
- Workflows: account_a=error | account_b=error | master=error
- Recall: 5 order emails | 4 matched | MISSES: Ashburn Proxies 2026-05-26 (order-last4 unavailable; auth token redacted)
- Precision: 0 recent rows | 0 confirmed | FALSE POSITIVES: none
- Triage: latest errors all failed at `n8n export:credentials`; workflows are active, healthz OK, direct credential export and read-only sheet probes pass, so the failure is not currently reproducible from read-only triage.
- Verdict: ANOMALIES

## 2026-05-27
- Workflows: account_a=error | account_b=error | master=error
- Recall: 5 order emails | 5 matched | MISSES: none
- Precision: 0 recent rows | 0 confirmed | FALSE POSITIVES: none
- Triage: latest errors all failed at `n8n export:credentials`; workflows are active, healthz OK, direct credential export and read-only Gmail/Sheets probes pass, so the likely cause is the workflow task-runner credential export path, not a currently failing Google Sheets read credential.
- Verdict: ANOMALIES
