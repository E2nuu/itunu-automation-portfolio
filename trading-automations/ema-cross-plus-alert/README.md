# 📈 EMA Cross Alert (MQL5)

A simple and reliable MetaTrader 5 script that monitors EMA(10) and EMA(20) crossovers on the **M5 timeframe**.  
It sends real-time alerts and push notifications when a bullish or bearish cross occurs.

---

## 🎯 Purpose

This tool helps traders stay alert for short-term trend shifts without needing to watch the charts all day.  
When the fast EMA crosses above or below the slow EMA, it immediately sends a notification so you can take action in time.

---

## ⚙️ How it works

1. The script calculates **two EMAs**:
   - **Fast EMA (10)**
   - **Slow EMA (20)**
2. It compares the most recent two closed candles on the M5 chart.  
3. When a crossover occurs:
   - If the fast EMA crosses **above** the slow EMA → a **Buy (📈)** alert is triggered.  
   - If the fast EMA crosses **below** the slow EMA → a **Sell (📉)** alert is triggered.  
4. Both an **on-screen alert** and a **MetaTrader push notification** are sent.

---

## 🧩 Inputs

You can modify the following parameters inside the MetaTrader 5 input panel:

| Parameter | Description | Default |
|------------|-------------|----------|
| `TF` | Timeframe used for EMA calculation | `M5` |
| `FastEMAPeriod` | Period of the fast EMA | `10` |
| `SlowEMAPeriod` | Period of the slow EMA | `20` |

---

## 🔔 Alerts and Notifications

The script uses two built-in MQL5 functions:
- `Alert()` for pop-up messages inside MetaTrader  
- `SendNotification()` for mobile push alerts  

> Make sure **push notifications** are enabled in your MetaTrader terminal settings  
> *(Tools → Options → Notifications → Enable Push Notifications)*  

---

## 🧠 Customization

- Change `TF` to any timeframe (e.g., `PERIOD_M1`, `PERIOD_M15`, or `PERIOD_H1`)  
- Adjust EMA periods to suit your trading system  
- Add your own sound or email alert logic using `PlaySound()` or `SendMail()`  

---

## 🪄 Example Signals

**Bullish Cross:**  
> 📈 EMA(10) crossed ABOVE EMA(20) on M5

**Bearish Cross:**  
> 📉 EMA(10) crossed BELOW EMA(20) on M5

---

## 🧰 Requirements

- MetaTrader 5 platform  
- Basic knowledge of attaching indicators or scripts  
- Push notifications enabled for mobile alerts (optional)

---

## 🧾 Notes

This script does not place trades automatically.  
It is designed purely for signal alerts to help traders time manual entries and exits more effectively.  
All calculations use standard EMA logic based on closing prices.

---

## 🧠 Author Notes

Created as part of **Itunu’s Trading Automations Portfolio** —  
a growing collection of practical trading tools and alert systems built for MetaTrader 5.

---

### 💾 File Info


**Author:** Itunu  
**Language:** MQL5  
**Category:** Trading Automations  
**Platform:** MetaTrader 5  

---
