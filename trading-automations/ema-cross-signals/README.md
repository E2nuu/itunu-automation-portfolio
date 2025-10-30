# 📈 EMA Cross Signals (MetaTrader 5)

[![Platform](https://img.shields.io/badge/Platform-MetaTrader%205-blue?logo=metatrader)]()
[![Category](https://img.shields.io/badge/Type-Trading%20Automation-green)]()
[![Language](https://img.shields.io/badge/Language-MQL5-lightgrey)]()

---

This MQL5 indicator draws **buy/sell signals** when the **Fast EMA** crosses the **Slow EMA**, and adds **retest confirmation arrows** for trend validation.

---

## ⚙️ How It Works

### 1️⃣ EMA Setup
- **Fast EMA** → triggers entry direction  
- **Slow EMA** → defines trend baseline  
- **Retest EMA** → confirms continuation after crossover  

### 2️⃣ Signals
- 🟢 **Buy Signal:** Fast EMA crosses **above** Slow EMA  
- 🔴 **Sell Signal:** Fast EMA crosses **below** Slow EMA  
- ⚪ **Retest Arrow:** Marks price retest confirmation on trend continuation  

### 3️⃣ Customization Parameters
| Parameter | Default | Description |
|------------|----------|-------------|
| FastEMAPeriod | 4 | Defines short-term trend speed |
| SlowEMAPeriod | 100 | Defines long-term trend |
| RetestEMAPeriod | 100 | Used to confirm retests |
| SignalTF | M15 | Timeframe for signal calculations |
| LookbackDays | 3000 | Historical bars processed |

---

## 🧩 Installation

1. Open **MetaTrader 5**  
2. Go to → `File → Open Data Folder → MQL5 → Indicators`  
3. Copy the file `EMACrossSignals.mq5` into the **Indicators** folder  
4. Restart or refresh **Navigator**  
5. Drag and drop **EMA Cross Signals** onto any chart  

---

## 💡 Usage

- Use for **trend visualization**, **retests**, or as a **foundation for EA strategies**.  
- Combine with other filters like RSI or MACD for higher accuracy.  

---

## 🧠 Notes

- Each **Buy** or **Sell** crossover is marked with a **colored vertical line**.  
- Retests are shown with **arrows** (green for buys, red for sells).  
- Clean visualization for strategy testing and journaling.  

---

### 🧰 Example Workflow
- Trend flips to bullish → Fast EMA crosses Slow EMA → 🟢 Green line appears  
- Price retests EMA → Confirmation candle → ✅ Arrow drawn  
- Repeat for bearish → 🔴 Red line  

---

**Author:** Itunu  
**Language:** MQL5  
**Category:** Trading Automations  
**Platform:** MetaTrader 5  
