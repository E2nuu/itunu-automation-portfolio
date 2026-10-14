# Clean-room rebuild scope

This is the implementation checklist for the second NexaFlow build. It records
capability categories observed during a high-level review of the supplied
employer project. It does not reproduce its implementation, branding, data
model, copy, metrics, visual design, or integrations.

## Shared application capabilities

- [ ] Role selection and sign-in with session expiry
- [ ] Role-aware navigation, page titles, user status, and sign-out
- [ ] Accessible mobile navigation and desktop sidebar
- [ ] Theme preference and clear focus states
- [ ] Toasts, loading states, empty states, and recoverable error messages
- [ ] Help centre with workflow guidance and deployment-safe links
- [ ] Public, synthetic-data leaderboard

## Agent workspace

- [ ] New-work queue with safe claim and a configurable customer segment
- [ ] Follow-up queue with due, overdue, and scheduled states
- [ ] Call workspace with a real `tel:` action and device-dialler explanation
- [ ] Customer context: consent, locale, time zone, tags, lifecycle, and history
- [ ] Structured call outcome, duration, notes, follow-up, and opt-out controls
- [ ] Client-side feedback and server-side validation for every interaction
- [ ] Idempotent interaction recording, lock renewal, and safe next-customer flow
- [ ] Personal dashboard, target progress, outcome mix, verified results, and earnings-free score explanation
- [ ] Notification centre and independently confirmed reactivation notice

## Lead and executive workspace

- [ ] Work allocation and queue health
- [ ] Campaign, period, locale, lifecycle, and outcome reporting filters
- [ ] Agent performance detail and team workload
- [ ] Cohort/tag drilldown based only on synthetic tags
- [ ] Transparent notes/reason analysis; no automated people decisions
- [ ] Export of aggregated synthetic reports
- [ ] Reactivation verification with attribution, notification, and audit record

## Administration and reliability

- [ ] Campaign lifecycle and priority management
- [ ] Controlled score/target configuration
- [ ] Audit review and workbook health status
- [ ] Synthetic data setup plus an idempotent workspace upgrade routine
- [ ] Explicit handling of intentionally excluded proprietary/external integrations
- [ ] Unit, contract, and manual Apps Script test plan

## Acceptance rule

The rebuild is not ready for another Apps Script copy/update sequence until the
items above have a concrete implementation, are mapped to the synthetic schema,
and have a focused manual test path. Source-line totals are not an acceptance
criterion; demonstrated capability, readability, and safety are.
