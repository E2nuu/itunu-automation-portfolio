## Automatically detect unsubscribe replies in your outreach emails and clean your Google Sheets contact list; keeping your domain reputation and deliverability strong.

---

## 🎯 Who it’s for

This template is designed for **freelancers, lead generation specialists, and outreach managers** — particularly those running email outreach campaigns for clients or personal lead-gen projects.

If you send cold emails, manage multiple lead lists, or handle outreach at scale, this workflow helps you automatically manage unsubscribe requests to maintain healthy email deliverability and protect your domain reputation.

---

## ⚙️ How it works

1. **Trigger:** The workflow starts when a new reply is received in your Gmail inbox.  
2. **Intent Detection:** The email text is analyzed using **OpenAI** to detect unsubscribe intent (“unsubscribe”, “remove me”, “opt out”, etc.).  
3. **Normalization & Filtering:** A **Code node** verifies the AI output for accuracy and ensures the result is standardized as either `"unsubscribe"` or `"keep"`.  
4. **Check & Update Sheets:**  
   - If the contact requested removal, the workflow checks your **Unsubscribe Sheet** to see if they’re already listed.  
   - If not, the contact is added to the **Unsubscribe Sheet** and simultaneously removed from your **Main Outreach Sheet**.  
5. **Optional Gmail Label:** Adds an **“Unsubscribe”** tag in Gmail for quick visual tracking (optional customization).

---

## 🧩 Requirements

To run this workflow, you’ll need:

- **Gmail Credentials** → for reading incoming replies and applying labels.  
- **Google Sheets Credentials** → to manage both the “Main” and “Unsubscribe” spreadsheets.  
- **OpenAI API Key** → used for detecting unsubscribe intent from message text.  

All credentials can be added through the **n8n Credentials Manager**.

---

## 🧠 How to Customize

- **Polling Time:** Adjust how often the Gmail Trigger checks for new replies (default: every 5 minutes).  
- **Sheets:** Replace the linked Google Sheets IDs with your own. You can change sheet names and columns freely.  
- **Intent Rules:** Modify the Code node to include additional unsubscribe phrases or alternate keywords.  
- **Optional Gmail Tagging:** Enable or disable tagging for unsubscribed messages.  
- **Secondary Validation:** Enable the second “If” check after the OpenAI node to double-confirm unsubscribe intent before moving contacts.

---

## 💡 Why this workflow matters

By automatically managing unsubscribe requests, you:

- Respect recipients’ opt-out preferences  
- Reduce spam complaints  
- Protect your **domain reputation** and **increase deliverability**  
- Save hours of manual list cleaning  

This is a must-have automation for anyone running **cold email outreach**, especially freelancers managing multiple client inboxes.

---

## 🪄 Quick Setup Tips

- Replace all `"Gmail account"` and `"Google Service Account account"` credential references with your actual credentials.  
- Ensure your sheet has an **EMAIL** column for lookup.  
- Test with a few mock replies before activating for production.  
- Optional: Add a **time-based trigger** to run the sheet cleanup periodically.
