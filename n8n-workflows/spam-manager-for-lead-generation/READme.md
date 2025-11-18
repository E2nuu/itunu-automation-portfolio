# 📬 SPAM MANAGER FOR LEAD GENERATION

An automation built for outreach professionals who care about performance, not just volume.

This workflow helps you protect your domain reputation and improve deliverability by automatically identifying bounce and spam replies like “Delivery failed” or “Mailbox full” from your Gmail inbox.  
It extracts those invalid emails and updates your NocoDB lead list — marking them as spam or moving them to a separate unsubscribe sheet.

By keeping your lists clean and accurate, you send fewer wasted emails, protect your sender score, and maintain a healthy domain reputation for long-term outreach success.

---

## ⚙️ Key Steps

1. **Gmail Trigger** – Watches for bounce or spam replies (e.g., `mailer-daemon@googlemail.com`).  
2. **Extract Email** – Captures the sender’s address from the message body.  
3. **Merge Logic** – Compares extracted emails with your main NocoDB lead sheet.  
4. **Spam Check & Update** – Marks matching entries as “SPAM” or moves them to your Unsubscribe list.  
5. **Tag & Mark Read** – Optionally tags and marks the message as processed in Gmail.  

---

## 🧩 Requirements
- Gmail Credentials (OAuth2)  
- NocoDB API Token  

Add both under **Credentials Manager** in n8n before running.

---

## 🧠 Why It Matters
High bounce rates damage your domain reputation and email deliverability.  
This workflow saves hours of manual cleanup, keeps your lists clean, and ensures your outreach performance remains consistent and trustworthy.

---

**Category:** Email & Data Hygiene  
**Author:** Itunu  
**Portfolio:** [Itunu’s Automation Portfolio](https://github.com/E2nuu/itunu-automation-portfolio)
