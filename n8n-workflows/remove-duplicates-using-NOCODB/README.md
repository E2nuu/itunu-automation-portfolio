# REMOVE DUPLICATES (NOCODB)

An automation built to keep your NocoDB  contact sheets clean and duplicate-free.

This workflow identifies and deletes duplicate records based on the **EMAIL** field; ensuring that each contact or unsubscribed address appears only once in your database.  

Perfect for Outreach teams managing lead lists or large databases that grow through multiple automations.

---

## 🎯 Who it’s for

Designed for **lead generation managers, CRM admins, and automation builders** using NocoDB as their outreach or data hygiene backend.  
If your lead data flows in from multiple sources, this workflow ensures duplicates are cleaned automatically without manual review.

---

## ⚙️ How it works

1. **Schedule Trigger:** Runs automatically at set intervals (daily, weekly, etc.).  
2. **Get NocoDB Table:** Pulls all entries from your chosen NocoDB sheet (usually Unsubscribe or Leads).  
3. **Remove Duplicates:** Compares records by the `EMAIL` field and removes duplicates.  
4. **Find Duplicate IDs:** Identifies which rows were duplicates and prepares them for deletion.  
5. **Delete Duplicates:** Removes the redundant entries from NocoDB permanently.  
6. **No-Op Node:** Ends the flow gracefully (for monitoring or logging purposes).

---

## 🧩 Requirements

- **NocoDB API Token** → Add under your n8n Credentials Manager  
- A **NocoDB project/table** with an `EMAIL` column  
- Scheduled or manual execution  

---

## 💡 Why it matters

Duplicate records slow down outreach, distort unsubscribe tracking, and make reporting unreliable.  
By automating duplicate removal, you:
- Keep your lead data clean and accurate  
- Prevent repeated outreach to the same contact  
- Maintain compliance and professionalism in communication  

---

## 🪄 Quick Setup Tips

- Replace your project and table IDs under **NocoDB nodes**.  
- Update the `EMAIL` field name if your column uses a different label.  
- Adjust the **Schedule Trigger** to your preferred frequency.  
- Test with a copy of your sheet before enabling deletion in production.  

## Optional
- It doesn't have to be **Email**, if you have any other primary identifier, that can work too.  

---

## 🧾 Workflow Info

**Workflow Name:** REMOVE DUPLICATES (NOCODB)  
**Category:** Data Cleaning & Maintenance  
**Version:** 1.0  
**Author:** Itunu  
**Portfolio:** [Itunu’s Automation Portfolio](https://github.com/E2nuu/itunu-automation-portfolio)
