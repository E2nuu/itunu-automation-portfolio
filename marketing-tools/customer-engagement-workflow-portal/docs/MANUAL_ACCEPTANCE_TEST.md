# Manual acceptance test

Run these checks in a private Apps Script web-app deployment after all source
files have been copied and `upgradeNexaFlowWorkspace` has completed. Use only
the fictional `.example` accounts created by the setup routine.

## Agent workflow

1. Sign in with `agent@nexaflow.example` and confirm the overview has metrics,
   a progress bar, recent activity, and no blank cards.
2. Open **Outbound workspace**. Confirm queue counts appear and use **Claim
   next**. The card should show customer context and a working `tel:` link.
3. Record a call-back with a future follow-up time, factual notes, and a valid
   duration. Confirm the interaction saves once, even after one browser retry.
4. Open **Follow-up queue**, open the due item, and confirm the call card
   appears. Use **Release and close**; confirm the queue refreshes.
5. Open **Customer history** for a work item assigned to the agent. Confirm
   locale, consent, history, and open follow-up context render.
6. Resize the browser to a narrow phone width. Confirm the navigation remains
   usable, the call action remains full-width, and tables scroll horizontally.

## Role workflows

1. Sign in as the lead account. Confirm team allocation and verification views
   are accessible while administration is not.
2. Sign in as the executive account. Confirm executive reporting, transparent
   note review, and the CSV export. The downloaded CSV must contain synthetic
   aggregate data only.
3. Sign in as the admin account. Confirm score settings, campaign management,
   audit readout, and workspace health are visible.
4. Verify that a non-admin cannot save configuration or manage campaigns by
   calling the UI or manually invoking its server function.

## Safety and reliability

1. Try to save an interaction without notes, with an invalid duration, and with
   an opt-out without a reason. Each must receive a server-side validation
   error.
2. Open the same customer from two sessions. Only one session should retain the
   live work lock.
3. Mark a notification read; its unread badge should update without a reload.
4. Toggle the theme and reload. The selected theme should remain available in
   that browser.
