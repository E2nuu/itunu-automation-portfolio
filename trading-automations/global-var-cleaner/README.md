# 🧹 Global Variable Cleaner with Auto Logging (MQL5)

A lightweight MetaTrader 5 utility that automatically scans and deletes EA-related global variables from the terminal.  
It prints each removed variable, its last stored value, and a clean summary before safely detaching itself from the chart.

---

## 🎯 Purpose

MetaTrader EAs often leave behind global variables such as TP, SL, or internal state markers.  
Over time, these accumulate on VPS setups and can interfere with new strategies or session restarts.

This tool gives traders a simple way to:
- Clean out old EA global variables  
- See **exactly what was deleted**  
- Automatically remove itself after cleaning  
- Keep VPS environments lightweight and error-free  

---

## ⚙️ How it works

1. On initialization, the script scans all existing global variables.  
2. It checks each name to see if it:
   - matches your EA’s **Magic Number**, and  
   - matches your optional **Symbol filter**  
3. For each match, it logs:
   - the variable name  
   - its most recent value  
   - category: TP, SL, or OTHER  
4. The script uses `GlobalVariableDel()` to delete the variable.  
5. After cleanup, it prints a summary and **auto-removes itself** using a timer.

---

## 🧩 Inputs

| Parameter | Description | Default |
|-----------|-------------|---------|
| `MagicNumber` | Identifies which EA’s globals to delete | `your magic number` |
| `SymbolFilter` | Optional filter (e.g., `"XAUUSD"`) or `""` for all | `""` |
| `DeleteAllGlobals` | If `true`, deletes **everything** (use carefully) | `false` |

---

## 🔍 What it Deletes

- Global vars containing the Magic Number  
- Global vars containing the specified Symbol (if provided)  
- Optional full wipe when `DeleteAllGlobals = true`  

### Categorization
During cleanup, each deleted variable is counted as:
- **TP** — if name contains `"TP"`  
- **SL** — if name contains `"SL"`  
- **Other** — everything else  

---

## 📈 Example Output

🧹 Starting global variable cleanup (with value log)...<br>
🧨 Deleted: EA_TP_your magic number = 1.234500 (Magic your magic number)<br>
🧨 Deleted: EA_SL_your magic number = 1.233100 (Magic your magic number)<br>
🧨 Deleted: EA_State_your magic number = 2.000000 (Magic your magic number)<br>
📊 Summary for Magic your magic number | SymbolFilter '' -> Deleted 3 total (TP=1, SL=1, Other=1)<br>
🧽 Auto-removal triggered. Detaching EA from chart...



---

## 🧠 Features

- Works on VPS and local MT5 setups  
- Auto-detaches after finishing  
- Fully safe: does not execute trades  
- Great for EA testing, optimizations, and strategy resets  
- Helps prevent stale data from affecting new sessions  

---

## 🚫 Notes

- If `DeleteAllGlobals = true`, the script erases **every** global variable in the terminal.  
  Use only when you understand the impact.  
- Does not touch market orders, account data, or files.  
- Logs are printed to the **Experts tab**.

---

## 🧠 Author Notes

Part of **Itunu’s Trading Automations Portfolio**, a set of practical tools designed to keep MetaTrader environments clean, stable, and easy to manage.

---

### 💾 File Information

**Author:** Itunu<br>
**Filename:** `GlobalVarCleaner_AutoValueLog.mq5`  
**Language:** MQL5  
**Category:** Utility / Maintenance  
**Platform:** MetaTrader 5  

---
