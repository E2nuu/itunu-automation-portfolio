# Architecture

## Layers

`index.html` and `leaderboard.html` are presentation clients. `styles.html` is a reusable responsive style partial included by the portal template. The clients call named Apps Script functions through `google.script.run`, render values with `textContent`, and hold only an opaque session token in memory.

`portal.gs` is the application-service layer. It authenticates sessions, authorizes each action, coordinates work claims, records interactions, creates follow-ups, verifies reactivations, and aggregates reporting data.

`rules.gs` holds environment-independent business rules: outcome normalization, duration validation, required follow-up logic, display-name cleanup, and score calculation. It uses a small UMD-style export so the same code can be tested locally.

`reports.gs` owns reporting read models. It derives role-scoped follow-up, campaign, team, and executive views from the operational tables without writing to them. This keeps dashboard calculations from changing workflow records.

`operations.gs` adds role-gated performance, explorer, insight, campaign-administration, and audit-read services. Its reporting functions remain read-only; only its campaign mutation path takes a lock and writes an audit event.

`helpers.gs` is the data-access and reliability layer. It maps worksheet headers to records, sanitizes user text, appends/patches records, writes audit events, hashes values, and serializes shared writes with `LockService`.

`setup.gs` is an explicit provisioning routine for a blank synthetic workbook. It is not called by web requests.

## State and reliability

- The browser receives a random opaque session token. The server caches only a SHA-256-derived token key with a 30-minute TTL.
- A work item may be claimed only when its next-action time is due and its lock is absent or expired. The claim expires after ten minutes.
- `saveInteraction` requires a client request ID and returns the first recorded result when the same request is retried. This protects against double clicks and network retries.
- All shared write paths take a script lock and always release it with `finally`.
- Audit events identify actor, entity, action, timestamp, and minimal metadata. They are append-only by application convention.

## Scaling boundaries

Google Sheets is appropriate for a portfolio, small team operations, and transparent review. At higher volume, worksheet scans should move to indexed storage and asynchronous job processing. Authentication should move to a managed identity provider, and dashboards should use pre-aggregated tables. The service boundaries in this project make those migrations localized.

