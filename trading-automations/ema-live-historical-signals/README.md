# 📊 EMA Live + Historical Signals

This **MQL5 indicator** draws Buy/Sell vertical lines when **price breaks above or below EMA(70)** on the M5 chart,  
and automatically backfills signals for the **past 3 months**.  

It also includes a **yellow EMA-follower line** that moves dynamically across all timeframes for visual trend tracking.

---

## ⚙️ How It Works
1. **Initialization:** Creates a 70-period EMA and prepares buffers for backfill.  
2. **Historical Scan:** Checks past ~90 days of data for EMA cross events and draws lines.  
3. **Live Signals:** Continuously monitors price →  
   - Green line when **close > EMA (Buy signal)**  
   - Red line when **close < EMA (Sell signal)**  
4. **EMA Follower Line:** A persistent yellow horizontal line that updates in real-time.

---

## 🧩 Inputs
| Parameter | Description |
|------------|-------------|
| `EMAPeriod` | Period of EMA (default: 70) |
| `SignalTF` | Timeframe used for signals (default: M5) |
| `LookbackDays` | How many days of historical data to draw (default: 90) |

---

## 🧠 Why It’s Useful
- Instantly visualize EMA breakouts and trend flips.  
- Backtest recent performance without manual scrolling.  
- Track EMA zones across all timeframes with a clear yellow guide line.  
- Works standalone or as part of a larger EA/automation system.

---

## 🪄 Customization Tips
- Change `EMAPeriod` to adapt for swing, scalp, or long-term charts.  
- Set `LookbackDays` to fine-tune how much historical data to draw.  
- You can modify the line colors and thickness in the code for visual clarity.

---

📁 **File:** [`EMALiveAndHistoricalSignals.mq5`](./EMALiveAndHistoricalSignals.mq5)
