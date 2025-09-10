import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import { ensureToken } from "@/services/token";
import { useDeviceStore } from "@/store/DeviceStore";


let client: mqtt.MqttClient | null = null;

export async function connectMqtt() {
    if (client) return client; // reuse connection

    const token = await ensureToken();
    const homeId = process.env.YOLINK_HOME_ID!;

    client = mqtt.connect("mqtt://api.yosmart.com:8003", {
        username: token,
        clientId: uuidv4(),
        keepalive: 30,          // send ping every 30s
        reschedulePings: true,  // reset timer when data flows
    });

    client.on("connect", () => {
        console.log("🟢 MQTT Connected");

        // subscribe once for all devices
        client!.subscribe(`yl-home/${homeId}/+/report`, (err) => {
            console.log("📡 Subscribed to /report");
        });

        client!.subscribe(`yl-home/${homeId}/+/response`, (err) => {
            console.log("📡 Subscribed to /response");
        });
    });


    client.on("message", (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            const deviceId = payload.deviceId;        // always present in payload
            const state = payload.data?.state;        // "open" | "close(d)"

            if (!deviceId || !state) return;          // skip if invalid

            console.log("📩 MQTT Message", { deviceId, state });
            // ✅ update only id + state
            useDeviceStore.getState().updateDevice(deviceId, { state });
        } catch (e) {
        }
    });


    return client;


}
