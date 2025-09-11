// store/AutomationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AutomationStore = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
};

export const useAutomationStore = create<AutomationStore>()(
  persist(
    (set) => ({
      enabled: false,
      setEnabled: (value) => set({ enabled: value }),
    }),
    { name: "automation-settings" } // stored in localStorage
  )
);
