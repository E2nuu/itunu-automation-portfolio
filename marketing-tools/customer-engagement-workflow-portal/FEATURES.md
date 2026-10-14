# Features

## Agent workspace

- Sign-in, session expiry, role-aware navigation, and clear error feedback
- Campaign selection and priority-ordered work queue
- Atomic work claim with visible lock semantics
- Customer profile access only for assigned work or elevated roles
- Call disposition, structured duration, factual notes, and opt-out reason validation
- Follow-up scheduling and a due follow-up count
- Dedicated due and overdue follow-up workspace that re-opens the correct customer work item
- Recent activity and personal outcome metrics
- Detailed 14-day performance trends, outcome mix, verified-value results, and recent verification activity
- In-app verification notifications

## Team lead and executive workspace

- Server-authorized manual work assignment
- Team workload visibility to support equitable manual allocation
- Aggregate queue, interaction, answer-rate, verification, and verified-value reporting
- Campaign-level filtering by campaign and time range
- Lifecycle, disposition, cohort, locale, and activity-trend reporting for executive review
- Interaction explorer with campaign and outcome filters, plus transparent recorded-note review
- Team-level workload, answer-rate, verified-value, and score views
- Ranked contributor view using explicit scoring parameters
- Reactivation verification with agent attribution and notification

## Administration

- Provision a complete synthetic workbook from an empty sheet
- Adjustable call, answer, verification, and daily-target rules
- Lookup worksheet and controlled configuration visibility
- Audit log for sign-in, work claim/assignment, interaction, verification, and configuration changes
- Campaign creation and controlled status/priority updates, user roster visibility, and audit-event review

## Design choices

The application rejects invalid dispositions, impossible durations, missing notes, missing follow-up times, and undocumented opt-outs. It treats consent as an operational control rather than an analytic label. It does not place outgoing calls, send messages, or make decisions about people.

