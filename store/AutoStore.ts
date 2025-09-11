"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Trigger = {
  event: string;        // e.g. "DoorSensor.Alert"
  state: string;        // e.g. "closed"
};

type Action = {
  deviceType: string;   // e.g. "Outlet"
  state: string;
};

export type Rule = {
  id: string;
  trigger: Trigger;
  action: Action;
};

type AutomationStore = {
  enabled: boolean;
  rules: Rule[];
  setEnabled: (value: boolean) => void;
  addRule: (rule: Rule) => void;
  removeRule: (id: string) => void;
    resetRules:()=>void
};

export const useAutomationStore = create<AutomationStore>()(
  persist(
    (set) => ({
      enabled: false,
      rules: [],
      resetRules: () => set({ rules: [] }), // 👈 clear all rules
      setEnabled: (value) => set({ enabled: value }),
      addRule: (rule) =>
        set((state) => {
          if (state.rules.some((r) => r.id === rule.id)) {
            return state; // 👈 no changes
          }
          return { rules: [...state.rules, rule] };
        }),
      removeRule: (id) =>
        set((state) => ({
          rules: state.rules.filter((r) => r.id !== id),
        })),
     
    }),
    { name: "automation-settings" }
  )
);
