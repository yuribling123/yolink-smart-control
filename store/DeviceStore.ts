"use client"
import { create } from "zustand";
import { persist } from "zustand/middleware";

// devices: {
//   "door123": { id: "door123", type: "DoorSensor", state: "open" },
//   "plug456": { id: "plug456", type: "Outlet", state: "closed" }
// }

type DeviceState = {
  id: string;
  type: string;
  info: Record<string, any>;
};

type DeviceStore = {
  devices: Record<string, DeviceState>;   // dictionary keyed by deviceId
  updateDevice: (id: string, data: Partial<DeviceState>) => void;
  reset: () => void;
};
//

export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set) => ({
      // 1️⃣ initial state
      devices: {},

      // 2️⃣ update or insert a device
      updateDevice: (id, data) =>
        set((state) => ({
          devices: { // need to return entire device object
            ...state.devices,
            [id]: {
              ...state.devices[id],
              ...data,
              id,
            },
          },
        })),


      // 3️⃣ reset
      reset: () => set({ devices: {} }),
    }),
    {
      name: "device-storage", // localStorage key
    }
  )
);

