# 🧾 Subscriptions Manager

Automatically track and manage all your recurring subscriptions, especially those outside your App Store or Play Store.  
This workflow helps you stay ahead of renewal dates, avoid missed payments, and maintain a simple record of all your active services.

---

## 🎯 Who it’s for

People who handle multiple online subscriptions and want a simple, centralized way to stay updated.  
Perfect for freelancers, digital creators, or small teams who rely on tools and memberships billed monthly or annually.

---

## ⚙️ How it works

1. The workflow runs daily with a **Schedule Trigger**.  
2. It retrieves all subscription records from your **Google Sheets** file.  
3. A **Code Node** calculates how many days remain before each renewal.  
4. **Conditional checks** determine which subscriptions are approaching renewal.  
5. The workflow sends **Slack reminders** based on urgency:  
   - 10 days before renewal  
   - 5 days before renewal  
   - 2 days before renewal  
6. You can confirm payments directly from Slack, and the sheet is automatically updated with your next renewal date.

---

## 🧩 Requirements

You’ll need the following credentials set up in your n8n instance:  
- **Google Sheets credentials** for reading and updating your subscription data  
- **Slack credentials** for sending reminders and marking subscriptions as renewed  

Your Google Sheet should include these columns:
**SERVICE
AMOUNT $$
AMOUNT (XXX)
LAST PAYMENT DATE
RENEWAL DATE
FREQUENCY**

*(Frequency can be Monthly, Quarterly, or Annually.)*

---

## 🧠 Customization

- Modify the reminder timing in the **If nodes** (default: 10, 5, and 2 days).  
- Adjust the **Schedule Trigger** to run weekly or monthly if preferred.  
- Edit Slack messages to match your tone and preferred formatting.  
- Add new notification channels such as email or Discord with extra nodes.  

---


## 🪄 Quick Setup Tips

- Replace all credential references with your own Google and Slack connections.  
- Add your Google Sheet ID (from your sheet URL).  
- Test with two or three sample subscriptions before going live.  
- For better accuracy, keep all date formats in ISO (YYYY-MM-DD).  

## 💡 Why this workflow matters

It keeps your recurring expenses organized and predictable.  
By tracking renewals in one place, you reduce unexpected charges and ensure your budget stays accurate.  
You also maintain a full history of paid and upcoming renewals, saving time on manual tracking.




