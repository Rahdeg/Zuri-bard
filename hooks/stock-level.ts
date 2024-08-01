import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

interface StockAlertStoreProp {
  stockLevelAlert: number;
  setStockLevelAlert: (level: number) => void;
}

const useStockAlert = create(
  persist<StockAlertStoreProp>(
    (set) => ({
      stockLevelAlert: 5, // Default stock level alert
      setStockLevelAlert: (level: number) => {
        set({ stockLevelAlert: level });
        toast.success("Stock level alert updated.");
      },
    }),
    {
      name: "stock-alert-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStockAlert;
