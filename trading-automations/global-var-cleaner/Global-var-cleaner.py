
//+------------------------------------------------------------------+
//|                                      GlobalVarCleaner_AutoValueLog.mq5 |
//|                         Author: You 🧹                             |
//|   Description: Deletes EA-related global variables automatically  |
//|   Shows each deleted variable name, its last value, and a summary |
//+------------------------------------------------------------------+
#property strict
#property version   "1.20"
#property copyright "You"
#property link      ""

//--- inputs
input long MagicNumber = 1613374653;       // <-- your EA's magic number
input string SymbolFilter = "";        // e.g. "XAUUSD" or leave blank for all
input bool DeleteAllGlobals = false;   // true = delete all globals (use with caution)

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   Print("🧹 Starting global variable cleanup (with value log)...");
   int deleted = ResetEA_GlobalVariables();
   PrintFormat("✅ Cleanup complete. Deleted %d global variable(s).", deleted);

   // Schedule auto-removal after logs flush
   EventSetTimer(2);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Timer event - safely removes the EA after finishing              |
//+------------------------------------------------------------------+
void OnTimer()
{
   EventKillTimer();
   Print("🧽 Auto-removal triggered. Detaching EA from chart...");
   ExpertRemove();
}

//+------------------------------------------------------------------+
//| Tick - not used                                                  |
//+------------------------------------------------------------------+
void OnTick() { }

//+------------------------------------------------------------------+
//| Delete EA-related global variables & log their values            |
//+------------------------------------------------------------------+
int ResetEA_GlobalVariables()
{
   int total = (int)GlobalVariablesTotal();
   int deleted = 0;
   string magicStr = IntegerToString(MagicNumber);

   int tpCount = 0, slCount = 0, otherCount = 0;

   for (int i = total - 1; i >= 0; i--)
   {
      string gvName = GlobalVariableName(i);

      bool matchMagic = (StringFind(gvName, magicStr) != -1);
      bool matchSymbol = (StringLen(SymbolFilter) == 0 || StringFind(gvName, SymbolFilter) != -1);

      if (DeleteAllGlobals || (matchMagic && matchSymbol))
      {
         double gvValue = GlobalVariableGet(gvName); // read value before deletion
         bool deletedOK = GlobalVariableDel(gvName);

         if (deletedOK)
         {
            deleted++;

            // Categorize for summary
            if (StringFind(gvName, "TP") != -1)
               tpCount++;
            else if (StringFind(gvName, "SL") != -1)
               slCount++;
            else
               otherCount++;

            PrintFormat("🧨 Deleted: %s = %.6f (Magic %s)", gvName, gvValue, magicStr);
         }
         else
         {
            PrintFormat("⚠️ Failed to delete: %s", gvName);
         }
      }
   }

   PrintFormat("📊 Summary for Magic %s | SymbolFilter '%s' -> Deleted %d total (TP=%d, SL=%d, Other=%d)",
               magicStr, SymbolFilter, deleted, tpCount, slCount, otherCount);

   return deleted;
}


