# Feature inventory and gap analysis

## Evidence reviewed

The supplied Apps Script files and workbook were reviewed only to identify general capabilities. The public implementation was written afresh. No production spreadsheet identifiers, people, organizations, phone numbers, URLs, credentials, styling, or source implementation were carried over.

## Original functional inventory

| Area | Observed general capability | NexaFlow treatment |
| --- | --- | --- |
| Access | Credential login, staff/executive context, enabled-status checks | Hashed synthetic credentials, role checks, expiring opaque sessions |
| Work distribution | Queued customer assignment, queue/segment selection, temporary record locks | Prioritized campaign queue, server-side claim, ten-minute lock, lead workload view and assignment |
| Engagement | Customer card, phone action, dispositions, notes, durations | Customer profile, consent, outcomes, validated notes/duration, follow-up field |
| Follow-up | Callback queue, dates, reminders | Follow-up records and due queue state |
| Reactivation | Attribution, verification, reward notifications | Reviewed verification lifecycle, attribution and agent notification |
| Analytics | Agent KPIs, campaign counts, conversion, revenue, countries, charts | Individual productivity progress, campaign/time filtering, team performance, lifecycle, disposition, cohort, locale, and verified-value reporting |
| Leaderboard | Ranked agent results | Configurable rule-based score and public read-only ranking page |
| Administration | Lookup lists, settings, guided help | Controlled configuration, lookup sheet, audit log, setup workflow |
| Reliability | Duplicate checks and spreadsheet updates | Idempotency key, script lock, lock-expiry validation, structured errors |

## Gap analysis and decisions

The original had bespoke, employer-context reporting and remote spreadsheet access. These are intentionally excluded. NexaFlow replaces them with neutral campaign, customer, interaction, reactivation, and audit relationships. It deliberately does not automate calls, send messages, collect payment, query a third-party churn workbook, or infer customer attributes. These are integration-specific or potentially sensitive workflows rather than portable portfolio requirements.

NexaFlow adds explicit data documentation, stable request IDs for retry safety, consent enforcement on opt-out, hashed passwords, server-side authorization on all mutations, and locally runnable pure-rule tests. The user interface covers agent, team lead, executive, and admin workflows from the same deployment. The seed routine now also provides a small linked activity history so each reporting view has fictional records to demonstrate.

