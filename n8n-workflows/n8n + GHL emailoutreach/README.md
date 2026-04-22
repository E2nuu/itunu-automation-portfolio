# 📧 Automated Initial Outreach Emails with Safety Controls

A robust, rate-limited email outreach system built to send personalized sequences from Google Sheets while preventing spam triggers and duplicate sends.

🔗 **[Download the Webhook JSON here](https://github.com/E2nuu/itunu-automation-portfolio/blob/main/n8n-workflows/Automated%20Initial%20Outreach%20Emails/webhook-conversion.json)** 🔗 **[Download the Campaign Roller JSON here](https://github.com/E2nuu/itunu-automation-portfolio/blob/main/n8n-workflows/Automated%20Initial%20Outreach%20Emails/campaign-roller.json)**

## 🏗️ System Overview
This automation serves as a "set-and-forget" outreach engine. Rather than blasting hundreds of emails at once and ruining domain reputation, it slowly processes leads, randomizes send times, sequences replies correctly, and stops instantly when a prospect converts.

The system relies on two distinct workflows:
1. **The Campaign Roller:** A scheduled job that checks a Google Sheet for eligible leads and sends out the correct email in the sequence.
2. **The Conversion Webhook:** A listener that immediately updates the sheet to pull a lead out of the sequence the moment they book a call or fill a form.

## ⚙️ Technical Architecture & Highlights

### 1. Smart Rate Limiting & Prioritization
* **Scheduled Batching:** The roller triggers every 5 hours, pulling down the list of leads from Google Sheets.
* **Algorithmic Selection:** A custom JavaScript node filters the list to ensure the prospect is marked "READY," has no previous engagement, and is due for an email based on the `Next_Send_Date`.
* **Retarget Priority:** The script sorts the eligible leads so that prospects deeper in the funnel (Retarget 1, 2, 3) are prioritized over net-new cold outreach. 
* **Hard Caps:** The workflow strictly slices the top 4 leads per run to simulate low-volume, high-touch human sending.

### 2. Humanized Sending Delays
To avoid pattern detection from spam filters, the workflow uses a dynamic formula in the Wait node:  
`($itemIndex * 7) + Math.floor(Math.random() * 12) + 2`  
This injects a randomized, highly variable delay (e.g., 9 minutes, 16 minutes, 23 minutes) between each individual email sent in the batch.

### 3. State-Aware Sequencing (The Switch)
Once a lead passes the eligibility checks, a Switch node evaluates their `Step_Number` column to determine the exact payload to send. 
* **Reply Threading:** Retarget emails use the native Gmail `reply` operation, passing the original `MESSAGE_ID` stored in the sheet to keep the conversation in a single thread, exactly like a human following up.

### 4. The Exit Hatch
When a prospect takes action (e.g., filling out a form in GoHighLevel), GHL fires a payload to the Webhook Receiver workflow. This instantly overwrites their row in Google Sheets, changing their status to "CONVERTED" and populating the "INTERESTED" column. The next time the Campaign Roller runs, the prospect fails the eligibility filter and is safely ignored.

## 🛠️ Tech Stack
* **Orchestration:** n8n (Self-hosted)
* **Database:** Google Sheets
* **Email Delivery:** Gmail API
* **Trigger Integrations:** GoHighLevel (Webhooks)
