"use client";
import { useEffect } from "react";
import { useDeviceStore } from "@/store/DeviceStore";
import { useMessageStore } from "@/store/MessageStore";

export default function Listener() {

    const updateDevice = useDeviceStore((s) => s.updateDevice);
    const { setMessage } = useMessageStore();

    useEffect(() => {
        const sse = new EventSource("/api/mqtt/event");

        sse.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const payload = JSON.parse(data.payload);
                if (!payload.deviceId) return;
                //update Device Store
                updateDevice(payload.deviceId, {
                    state: payload.data?.state,
                });
                console.log("update zustand")
                console.log("state: ", payload.data?.state)
                const updated = useDeviceStore.getState().devices[payload.deviceId];
                console.log("zustand store now:", updated);
                //update Message Store
                if (payload?.deviceId && payload?.time && payload?.data?.state) {
                    setMessage({
                        deviceId: payload.deviceId,
                        time: payload.time,
                        state: payload.data.state,
                    });
                }



            } catch (e) {
            }
        };

        return () => sse.close();
    }, [updateDevice]);

    return null;
}
