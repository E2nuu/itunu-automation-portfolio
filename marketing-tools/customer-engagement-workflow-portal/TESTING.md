# Testing

## Locally executed tests

Run `npm test` from the repository root. The tests require Node 20 or later and no third-party packages.

- `rules.test.cjs` tests duration boundaries, outcome normalization, follow-up requirements, interaction validation, score arithmetic, and display cleanup.
- `contract.test.cjs` verifies the required application files and critical service endpoints are present, including locking, idempotency, safe DOM rendering patterns, and reporting services.

## Required Apps Script runtime checks

After copying to a blank, synthetic Google Sheet:

1. Run `setupNexaFlowSyntheticDatabase` and confirm all eleven worksheets, headers, filters, and fictional records are created.
2. Sign in as the demo agent and claim a work item. In a second browser session, confirm it cannot be claimed until the lock expires.
3. Save a callback interaction, retry the same request payload with the same request ID, and confirm only one interaction row exists.
4. Try to save without notes, with 60 seconds, without a callback time, and with an opt-out missing a reason. Confirm each is rejected.
5. Use a team-lead login to assign work and verify a reactivation. Confirm a notification appears only for the attributed agent.
6. Use the admin login to change score weights. Confirm the leaderboard changes and an audit event is added.
7. Verify agents cannot load an unassigned customer profile or change configuration.
8. Sign in as the lead and executive synthetic users to inspect workload allocation, campaign filtering, lifecycle/disposition, cohort, and locale reporting.

## Test boundary

The local tests cover pure logic because Apps Script services such as `SpreadsheetApp`, `CacheService`, and `LockService` exist only in the Google runtime. The manual checks above must run only against a new synthetic workbook, never a production spreadsheet.

