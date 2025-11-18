# 📈 DAILY LEAD GEN REPORT (NOCODB)

An automation that generates a daily performance summary of your lead-generation campaigns; pulling real-time data from NocoDB and delivering a structured report to Slack.

This workflow helps you stay on top of key metrics like total leads, engagement levels, email deliverability, and unsubscribes, all in a single daily message.

---

## 🎯 Who It’s For

For **lead-generation managers, sales teams, and automation builders** who track campaigns through a DB and want instant visibility into performance without checking spreadsheets.

---

## ⚙️ How It Works

1. **Schedule Trigger** – Runs automatically every evening.  
2. **Fetch NocoDB Data** – Pulls from both your lead sheet and unsubscribe sheet.  
3. **Merge & Process Data** – The function node calculates daily stats, engagement levels, and trends.  
4. **Generate Slack Report** – Sends a well-formatted daily summary directly to your Slack channel.  
5. **No Operation** – Ends the workflow cleanly after posting.  

---

## 🧩 Requirements

- **NocoDB API Token** → Add to n8n credentials.  
- **Slack API Credentials** → For report delivery.  
- Tables with fields like `EMAIL`, `STATUS`, `SOURCE`, and `INTERESTED`.  (These can be changed based on your outreach needs)

---

## 💡 Why It Matters

Teams often run campaigns across multiple tools but lose clarity on daily performance.  
This workflow turns your lead and unsubscribe tables into a daily insight feed  ensuring your team acts fast on trends, engagement changes, or spikes in unsubscribes.

It replaces manual spreadsheet checks with automation-driven accountability.

---

## 🪄 Quick Setup Tips

- Update your **Slack channel** under the Slack node.  
- Replace the NocoDB project and table IDs with your own.  
- Adjust schedule time to match your reporting window.  
- You can expand this workflow to generate **weekly summaries** using the same logic.  

---

## Optional
- You can easily merge more than 2 sheets if you're working with more.

---

## 🧾 Workflow Info

**Workflow Name:** DAILY LEAD GEN REPORT (NOCODB)  
**Category:** Reporting & Analytics  
**Version:** 1.0  
**Author:** Itunu  
**Portfolio:** [Itunu’s Automation Portfolio](https://github.com/E2nuu/itunu-automation-portfolio)
