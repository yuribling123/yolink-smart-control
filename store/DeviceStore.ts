import { create } from "zustand";

// devices: {
//   "door123": { id: "door123", type: "DoorSensor", state: "open" },
//   "plug456": { id: "plug456", type: "Outlet", state: "closed" }
// }

type DeviceState = {
  id: string;
  type: string;         // "DoorSensor" | "Outlet"
  state?: string;       // "open" | "closed"
};

type DeviceStore = {
  devices: Record<string, DeviceState>;   // dictionary keyed by deviceId
  updateDevice: (id: string, data: Partial<DeviceState>) => void;
  reset: () => void;
};

export const useDeviceStore = create<DeviceStore>((set) => ({
  // 1️⃣ initial state
  devices: {},

  // 2️⃣ function to update or insert a device
  updateDevice: (id, data) =>
    set((state) => ({
      devices: {
        ...state.devices,        // keep all existing devices
        [id]: {
          ...state.devices[id],  // keep old fields of this device (if already exists)
          id,                    // always make sure id is present
          ...data,               // apply the new updates
        },
      },
    })),

  // 3️⃣ reset the store back to empty
  reset: () => set({ devices: {} }),
}));
