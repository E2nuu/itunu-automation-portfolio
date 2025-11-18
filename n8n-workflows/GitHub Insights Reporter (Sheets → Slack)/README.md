# GitHub Insights Reporter (Sheets → Slack)

GitHub only keeps traffic analytics like views and clones for 14 days before deleting them; which makes it easy to lose valuable performance data over time.
  
This workflow automatically collects your GitHub traffic metrics (views, unique visitors, clones, and cloners), saves them in Google Sheets for long-term tracking, and delivers a concise weekly summary to Slack.  

It keeps your growth insights visible, historical, and actionable; without ever needing to log into GitHub.

---

## 🎯 Who it’s for
For developers, freelancers, or open-source contributors who want to monitor project growth, track visibility, and share insights with their teams; all without manual reporting.

---

## ⚙️ How it works
1. **Trigger:** Runs automatically on a schedule.  
2. **Fetch Data:** Uses the GitHub API to retrieve repository traffic stats.  
3. **Format Data:** Code node structures the data into a clean date-based format.  
4. **Store Data:** Google Sheets logs the new entries for historical tracking.  
5. **Slack Report:** Sends a formatted summary (views, unique views, clones, unique cloners) to your chosen Slack channel.

---

## 🧩 Requirements
To run this workflow, you’ll need:
- **GitHub API Credentials** → For accessing repository analytics  
- **Google Sheets Credentials** → For storing historical performance data  
- **Slack Credentials** → To send summary notifications  

All credentials can be securely added through the **n8n Credentials Manager**.

---

## 🧠 Why this workflow matters
Developers often miss how their repositories are performing week to week because GitHub only displays limited analytics in-app.  

This automation helps you keep that insight visible and structured; giving you quick access to engagement data that actually helps guide your projects.  

No more manual exporting. No more guessing. Just weekly visibility delivered to your workspace.

---

## 🪄 Quick Setup Tips
- Replace GitHub repo name in the HTTP Request node with your own.  
- Adjust schedule timing for your preferred reporting day.  
- Edit the Slack node’s message format to include team mentions or emoji highlights.  
- Add more repositories by duplicating the GitHub request and merge steps.

---



## 🧾 Workflow Info

**Workflow Name:** GitHub Insights Reporter (Sheets → Slack)  
**Category:** Reporting & Analytics  
**Version:** 1.0  
**Author:** Itunu  
**Portfolio:** [Itunu’s Automation Portfolio](https://github.com/E2nuu/itunu-automation-portfolio)
