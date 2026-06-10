# Finance Data Layer

Last updated: 2026-06-10T07:21:54Z
Owner/orchestrator: Hermes / Janus

## Purpose

Local, read-only business finance data layer for Papi's Chase Business Checking cash position and Amex/Chase card analysis. Agents should use sanitized CLI outputs from `/root/finance-data/bin/finance`; they should not receive bank passwords, MFA codes, Plaid secrets, raw Plaid tokens, account numbers, card numbers, or raw Plaid payloads in chat/prompts/docs.

## Current status

- Spec 122 Phase 1: accepted; local SQLite/CLI scaffold, CSV import, sanitized summary/due/optimizer commands.
- Spec 123 Phase 2: accepted; Plaid-ready read-only ingestion hardening.
- Spec 124 Phase 3: complete and final-mid accepted at `/root/reviews/124-phase3-final-mid-review-v7.md`.
- Completion marker: `/root/tasks/124-phase3-complete.done`.
- Current live DB status at acceptance: schema version 4, no real financial rows ingested yet.
- Current Plaid status at acceptance: CLI code available, config safely unconfigured, network not ready, sync not ready.

## Important paths

- Finance system root: `/root/finance-data/`
- CLI: `/root/finance-data/bin/finance`
- README/runbook: `/root/finance-data/README.md`
- DB directory: `/root/finance-data/db/`
- Secret root: `/root/secrets/finance/`
- Plaid config file: `/root/secrets/finance/plaid.json`
- Plaid Item secrets: `/root/secrets/finance/plaid-items/`
- Plaid runtime tokens: `/root/secrets/finance/plaid-runtime/`
- Plaid inbox for local public-token handoff: `/root/secrets/finance/plaid-inbox/`

## Security boundaries

- Read-only only. No ACH, transfers, bill pay, card payments, account-setting writes, or money movement.
- Plaid production is blocked in Phase 3 even with allow flags; production requires a separate explicit human-approved spec.
- Sandbox is the intended environment.
- Development requires explicit `--allow-non-sandbox` and is still not production.
- Network-capable Plaid commands enforce environment gates before live client/network construction.
- Token commands must not print raw access/public/link tokens.
- Secret files must be root-owned, non-symlink, mode 0600; directories mode 0700.
- Tests must not mutate `/root/secrets/finance`; final acceptance verified before/after snapshots unchanged.
- No financial data should be written into this Obsidian vault.

## Accepted Phase 3 controls

Final review v7 accepted:

- Compile check passed.
- `tests/test_gate_before_client.py`: 7/7 probes passed.
- `tests/test_plaid_live.py`: 83/83 tests passed.
- `/root/finance-data/smoke-test.sh`: 71 passed / 0 failed.
- `/root/secrets/finance` was unchanged by required test programs.
- All Plaid network command handlers gate before client construction.
- Production hard-block, development allow gate, config/preflight/refusal audits, safe token handling, hashed transaction refs, liabilities rollback, per-Item atomic sync, and no-money-movement endpoint inspection all passed.

## Safe operator commands

Safe/no-network status:

```bash
/root/finance-data/bin/finance status --json
/root/finance-data/bin/finance plaid-status --json
/root/finance-data/bin/finance plaid-items --json
```

Verification suite:

```bash
python3 -m compileall -q /root/finance-data/lib /root/finance-data/bin /root/finance-data/tests
PYTHONPATH=/root/finance-data/lib python3 /root/finance-data/tests/test_gate_before_client.py
PYTHONPATH=/root/finance-data/lib python3 /root/finance-data/tests/test_plaid_live.py
/root/finance-data/smoke-test.sh
```

Phase 4 sandbox setup should start from the runbook in `/root/finance-data/README.md`, not from chat-pasted credentials.

## Recommended next session

1. Re-orient by reading this note plus `/root/context/finance-phase3-session-handoff.md`.
2. Confirm Papi wants Phase 4 sandbox credential setup.
3. If yes, create a new `owner: hermes` spec/task for controlled Plaid sandbox configuration and first sandbox Item sync.
4. Do not ask Papi to paste secrets into Telegram. Use local root-only file editing for `/root/secrets/finance/plaid.json`.
5. Keep production and real Chase/Amex credentials out of scope until separately approved.
