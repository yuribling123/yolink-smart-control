"use client";
import { useEffect } from "react";
import { useDeviceStore } from "@/store/DeviceStore";
import { useMessageStore } from "@/store/MessageStore";
import { useAutomationStore } from "@/store/AutoStore";

interface ListenerProps {
    devices: any[];
}

export default function Listener({ devices }: ListenerProps) {

    const updateDevice = useDeviceStore((s) => s.updateDevice);
    const { setMessage } = useMessageStore();
    const { enabled, rules } = useAutomationStore();

    useEffect(() => {
        const sse = new EventSource("/api/mqtt/event");


        sse.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const payload = JSON.parse(data.payload);
                // if (!payload.deviceId || payload?.time || !payload?.data?.state) return;

                //update Device Store
                updateDevice(payload.deviceId, {
                    info: {
                        state: payload.data?.state
                    }
                });
                //update Message Store
                setMessage({
                    deviceId: payload.deviceId,
                    time: payload.time,
                    state: payload.data.state,
                });
                //load rules
                // if (!enabled) return
                console.log("now rule")
                console.log("rules", rules)


                if (!enabled) { return }
                rules.forEach(

                    (rule) => {
                        console.log("running rule")
                        console.log("devices", devices)
                        if (rule.trigger.event == payload.event && rule.trigger.state == payload.data?.state) {
                            console.log("match run rule")
                            const target = devices.find((d) => d.type === rule.action.deviceType)
                            if (!target) return
                            console.log("find device")
                            // have to be more dynamic in the future

                            fetch(`/api/${target.type.toLowerCase()}/${target.deviceId}/action`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ state: rule.action.state }),
                            })
                                .then(async (res) => {
                                    const json = await res.json();
                                    console.log("post")
                                    if (json.result?.desc !== "Success") {
                                        console.log(json.result?.desc)
                                    }
                                    updateDevice(target.deviceId, {
                                        info: {
                                            state: rule.action.state,
                                        },
                                    });

                                })
                                .catch((e) => console.error(e));

                        }

                    }
                )



            } catch (e) {
            }
        };

        return () => sse.close();
    }, [updateDevice, rules, devices, enabled]);

    return null;
}
