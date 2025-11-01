### 🎯 Who it’s for
Teams and automation builders who want to **instantly receive alerts** when any n8n workflow fails; directly in **Slack** or **Gmail**.  
This helps you detect broken automations, API failures, or rate-limit issues before they cascade.

---

### ⚙️ How it works
1. Uses the built-in **Error Trigger** node: automatically fires whenever another workflow fails.  
2. Extracts details such as:
   - Workflow name  
   - Workflow ID  
   - Node that failed  
   - Error message  
   - Execution ID & time  
3. Sends two alerts:
   - 📨 **Slack** message (formatted text)
   - 📧 **Gmail** email (HTML-formatted with “View Execution” button)

---

### 🧩 Requirements
- A connected **Slack** credential  
- A connected **Gmail** credential  

---

### 💡 Why this matters
n8n automations can silently fail due to API changes or expired credentials.  
This workflow ensures you **never miss a failure**, giving you real-time notifications across your communication channels.

---

### 🪄 Setup Tips
- Open **each of your workflows → Settings → Error Workflow** → select this workflow as the linked error handler.  
- You can expand notifications to Discord, Notion, or Telegram by adding a **Webhook Alert** node.  
- Customize messages to include workflow duration or severity levels.

---

### 🧱 Optional Enhancements
- Add a severity detector for keywords like `timeout` or `failed`
- Log errors into a Google Sheet for weekly summaries
- Connect Notion API for visual error dashboards

---


### 🏷️ Tags
`#ErrorHandling` `#Monitoring` `#Slack` `#Gmail` `#Alerts`

### 📁 Files
| File | Description |
|------|--------------|
| `ErrorNotification_Cleaned_Valid.json` | n8n workflow file ready for import |
| `README.md` | Documentation for GitHub portfolio |

---

© 2025 E2nu — Part of the *Itunu Automation Portfolio*
