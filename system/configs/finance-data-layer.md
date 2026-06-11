# Finance Data Layer

Last updated: 2026-06-11T20:20:00Z
Owner/orchestrator: Hermes / Janus

## Purpose

Local, read-only business finance data layer for Papi's Chase Business Checking cash position and Amex/Chase card analysis. Agents should use sanitized CLI outputs from `/root/finance-data/bin/finance`; they should not receive bank passwords, MFA codes, Plaid secrets, raw Plaid tokens, account numbers, card numbers, or raw Plaid payloads in chat/prompts/docs.

## Current status

- Spec 122 Phase 1: accepted; local SQLite/CLI scaffold, CSV import, sanitized summary/due/optimizer commands.
- Spec 123 Phase 2: accepted; Plaid-ready read-only ingestion hardening.
- Spec 124 Phase 3: complete and final-mid accepted at `/root/reviews/124-phase3-final-mid-review-v7.md`.
- Completion marker: `/root/tasks/124-phase3-complete.done`.
- **Spec 130 Phase 4: accepted with safe blocker.** Sandbox activated, sync ready, Plaid Items for Chase-like and Amex-like institutions created and synced.
- Phase 4 completion markers: `/root/tasks/130-finance-phase4-sandbox-activation.done`, `/root/tasks/130-finance-phase4-sandbox-activation-cash-safety.done`, `/root/tasks/130-finance-phase4-sandbox-activation.blocked`.
- Phase 4 final accepted review: `/root/reviews/130-finance-phase4-sandbox-activation-final-mid-review-2.md`.
- Phase 4 handoff: `/root/context/finance-phase4-session-handoff.md`.

### Phase 4 accepted state

- Plaid config: `configured=true`, `config_valid=true`, `environment=sandbox`, `environment_gate=allowed`.
- Sandbox Items: 2 (`chase-business-checking`, `amex-cards`), `sync_ready=true`.
- DB populated: schema version 4, 1 institution, 12 accounts, 12 balances, 100 transactions, 2 sync-state records, 0 liabilities.
- Compatibility patch: `initial_products` for sandbox public-token create.
- Targeted tests: 89 passed (test_plaid_live + test_gate_before_client).
- Cash account: intentionally unset (`is_cash_account=1` is zero). Accepted safe blocker because sandbox institution labels are generic/ambiguous ("Plaid Checking") with no confirmed Chase/JP Morgan provenance. Future real Chase/JP Morgan depository checking Item needed before cash designation.

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
- Plaid production remains blocked unless a separate explicit human-approved spec changes that boundary.
- Current configured environment is sandbox; Phase 5 real-account work must remain view-only/read-only unless explicitly re-scoped.
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

Phase 4 is already sandbox-activated; future Phase 5 work should start from the runbook and `/root/context/finance-phase4-session-handoff.md`, not from chat-pasted credentials.

## Recommended next session

1. Re-orient by reading this note plus `/root/context/finance-phase4-session-handoff.md`.
2. Confirm Papi wants Phase 5: real Plaid Link / production-readiness (view-only).
3. If yes, create a new `owner: hermes` spec/task for controlled real-account Plaid Link setup.
4. **Phase 5 constraints:** read-only only, explicit human approval required for every account, Papi must explicitly connect each account via Plaid Link browser flow, no money movement, no autopay, no payment initiation.
5. Do not ask Papi to paste secrets or tokens into Telegram. Use local root-only file editing.
6. Do not set the cash account until a real Chase/JP Morgan depository checking Item exists with verified provenance.
