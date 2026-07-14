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

## 2026-05-28
- Workflows: account_a=error | account_b=error | master=error
- Recall: 4 order emails | 3 matched | MISSES: J.Crew ...5974 2026-05-27
- Precision: 11 recent rows | 2 confirmed | FALSE POSITIVES: none
- Errors: account_a/account_b/master all failed at `n8n export:credentials --all --decrypted --output=/tmp/order-parser-creds-*.json` via `node /files/order-parser/order_parser.js`.
- Triage: likely workflow task-runner credential export path failure, consistent with prior `n8n-parser-triage` findings; diagnose only, no remediation run.
- Verdict: ANOMALIES

## 2026-05-29
- Workflows: account_a=ok | account_b=ok | master=ok
- Recall: 9 order emails | 9 matched | MISSES: none
- Precision: 9 recent rows | 9 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-05-30
- Workflows: account_a=ok | account_b=ok | master=ok
- Recall: 6 order emails | 5 matched | MISSES: Amazon order-last4 unavailable 2026-05-30 (Rolling Cones delivery)
- Precision: 7 recent rows | 7 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-05-31
- Workflows: account_a=ok | account_b=ok | master=ok
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 4 recent rows | 4 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-01
- Workflows: account_a=ok | account_b=ok | master=ok
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 6 recent rows | 6 confirmed | FALSE POSITIVES: none
- Verdict: OK
## 2026-06-02
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 6 recent rows | 4 confirmed | FALSE POSITIVES: Pokemon Center ...2122 2026-06-02; Capital One Shopping Support ...8317 2026-06-01
- Verdict: ANOMALIES

## 2026-06-03
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 4 recent rows | 2 confirmed | FALSE POSITIVES: Pokemon Center ...2122 2026-06-02; Capital One Shopping Support ...8317 2026-06-01
- Verdict: ANOMALIES

## 2026-06-04
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 3 matched | MISSES: J.Crew order-last4 unavailable 2026-06-03
- Precision: 12 recent rows | 12 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-06-05
- Workflows: account_a=success | account_b=success | master=success
- Recall: 3 order emails | 3 matched | MISSES: none
- Precision: 3 recent rows | 3 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-06
- Workflows: account_a=success | account_b=success | master=success
- Recall: 2 order emails | 1 matched | MISSES: Mercari order-last4 unavailable 2026-06-06
- Precision: 2 recent rows | 2 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-06-07
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 2 recent rows | 2 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-08
- Workflows: account_a=success | account_b=success | master=success
- Recall: 2 order emails | 2 matched | MISSES: none
- Precision: 2 recent rows | 2 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-09
- Workflows: account_a=error (OAuth invalid_grant) | account_b=success | master=error (OAuth invalid_grant)
- Recall: 1 observable order email | 1 matched | MISSES: none; account_a probe unavailable
- Precision: 1 observable recent row | 1 confirmed | FALSE POSITIVES: none; account_a and master probes unavailable
- Findings: account_a `FAILED account a` after OAuth refresh returned `invalid_grant` (`Token has been expired or revoked.`); master `FAILED master` for the same cause. Likely OAuth credential failure; diagnose via `n8n-parser-triage` only.
- Verdict: ANOMALIES

## 2026-06-10
- Workflows: account_a=success | account_b=success | master=success
- Recall: 1 order emails | 1 matched | MISSES: none
- Precision: 1 recent rows | 1 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-11
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 3 recent rows | 3 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-12
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 3 matched | MISSES: TikTok Shop order-last4 unavailable 2026-06-12
- Precision: 3 recent rows | 3 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-06-13
- Workflows: account_a=success | account_b=success | master=success
- Recall: 3 order emails | 3 matched | MISSES: none
- Precision: 4 recent rows | 4 confirmed | FALSE POSITIVES: none
- Correction (2026-06-14): the prior fourth candidate was a FedEx notification for parser-excluded Abercrombie personal apparel, so it was not recall-eligible.
- Verdict: OK

## 2026-06-14
- Workflows: account_a=success | account_b=success | master=success
- Recall: 1 order emails | 1 matched | MISSES: none
- Precision: 3 recent rows | 3 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-15
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 2 recent rows | 1 confirmed | FALSE POSITIVES: Alibaba …0582 2026-06-15
- Verdict: ANOMALIES

## 2026-06-16
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 7 recent rows | 7 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-17
- Workflows: account_a=success | account_b=success | master=success
- Recall: 3 order emails | 2 matched | MISSES: Madewell order-last4 unavailable 2026-06-16
- Precision: 6 recent rows | 6 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-06-18
- Workflows: account_a=success | account_b=success | master=success
- Recall: 12 order emails | 12 matched | MISSES: none
- Precision: 8 recent rows | 8 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-19
- Workflows: account_a=success | account_b=success | master=success
- Recall: 8 order emails | 8 matched | MISSES: none
- Precision: 10 recent rows | 10 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-20
- Workflows: account_a=success | account_b=success | master=success
- Recall: 6 order emails | 6 matched | MISSES: none
- Precision: 8 recent rows | 7 confirmed | FALSE POSITIVES: Mattel Creations …6434 2026-06-20 (review-request email only)
- Verdict: ANOMALIES

## 2026-06-21
- Workflows: account_a=success | account_b=success | master=success
- Recall: 6 order emails | 6 matched | MISSES: none
- Precision: 6 recent rows | 6 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-22
- Workflows: account_a=success | account_b=success | master=success
- Recall: 1 order emails | 1 matched | MISSES: none
- Precision: 3 recent rows | 3 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-23
- Workflows: account_a=success | account_b=success | master=success
- Recall: 8 order emails | 8 matched | MISSES: none
- Precision: 6 recent rows | 4 confirmed | FALSE POSITIVES: Walmart …0147 2026-06-22 (junk partial order number); Walmart …0148 2026-06-22 (junk partial order number)
- Verdict: ANOMALIES

## 2026-06-24
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 3 matched | MISSES: eBay Dayton Audio Classic B65 order-last4 unknown 2026-06-24
- Precision: 5 recent rows | 5 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-06-25
- Workflows: account_a=success | account_b=success | master=success
- Recall: 1 order emails | 0 matched | MISSES: account_b verification failed (Sheets HTTP 503); eBay delivery update order-last4 unknown 2026-06-24 unverified
- Precision: 1 recent rows | 0 confirmed | FALSE POSITIVES: Walmart …0148 2026-06-22 (junk partial order number); account_b precision check failed (Sheets HTTP 503)
- Verdict: ANOMALIES

## 2026-06-26
- Workflows: account_a=success | account_b=success | master=success
- Recall: 2 order emails | 2 matched | MISSES: none
- Precision: 3 recent rows | 2 confirmed | FALSE POSITIVES: Robinhood Credit Card no order-last4 2026-06-25 (card-delivery email, not order)
- Verdict: ANOMALIES

## 2026-06-27
- Workflows: account_a=success | account_b=success | master=success
- Recall: 2 order emails | 2 matched | MISSES: none
- Precision: 5 recent rows | 4 confirmed | FALSE POSITIVES: Capital One Business no order-last4 2026-06-27 (card-shipment email, not order)
- Verdict: ANOMALIES

## 2026-06-28
- Workflows: account_a=success | account_b=success | master=success
- Recall: 2 order emails | 2 matched | MISSES: none
- Precision: 2 recent rows | 2 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-29
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 1 recent rows | 1 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-06-30
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 4 recent rows | 3 confirmed | FALSE POSITIVES: Sakuras Card Shop no order-last4 2026-06-29 (store-wide ORDER UPDATE/preorder notice, not a specific order)
- Verdict: ANOMALIES
- Resolution 2026-07-01: added a sender-aware Sakuras Card Shop `ORDER UPDATE` subject gate plus fixture, pruned account_b row 49/source msg `19f14844516707ba`, rebuilt Master (`account_a_rows=18`, `account_b_rows=47`, `output_rows=64`, `deduped=1`), and verified no malformed Sakuras blank-order rows remain.

## 2026-07-01
- Workflows: account_a=success | account_b=success | master=success
- Recall: 4 order emails | 4 matched | MISSES: none
- Precision: 5 recent rows | 5 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-07-09
- Workflows: account_a=success | account_b=success | master=success
- Recall: 9 order emails | 2 matched | MISSES: Alibaba …0582 2026-07-09 (2 orders)
- Precision: 1 recent rows | 1 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-07-10
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 1 recent rows | 1 confirmed | FALSE POSITIVES: none
- Verdict: OK

## 2026-07-11
- Workflows: account_a=success | account_b=success | master=success
- Recall: 3 order emails | 2 matched | MISSES: LACourt …8292 2026-07-10
- Precision: 2 recent rows | 2 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES

## 2026-07-12
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 2 recent rows | 0 confirmed | FALSE POSITIVES: Alibaba …0582 2026-07-08 (2 rows)
- Verdict: ANOMALIES

## 2026-07-13
- Workflows: account_a=success | account_b=success | master=error
- Recall: 1 order emails | 1 matched | MISSES: none
- Precision: 1 recent rows | 1 confirmed | FALSE POSITIVES: none
- Verdict: ANOMALIES
- Finding: master failed on Google Sheets clear/write (`A:K:clear` HTTP 500 INTERNAL); likely transient Sheets API failure per parser master path.

## 2026-07-14
- Workflows: account_a=success | account_b=success | master=success
- Recall: 0 order emails | 0 matched | MISSES: none
- Precision: 2 recent rows | 0 confirmed | FALSE POSITIVES: Loaded Sales …2032 2026-07-12; Amazon …0265 2026-07-14
- Verdict: ANOMALIES
