import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import { ensureToken } from "@/services/token";

let client: mqtt.MqttClient;

export async function connectMqtt() {

    if (client) return client; // reuse if already connected

    const token = await ensureToken();
    const homeId = process.env.YOLINK_HOME_ID!;

    client = mqtt.connect("mqtt://api.yosmart.com:8003", {
        username: token,
        clientId: uuidv4(),
    });

    client.on('connect', function () {
        console.log('Connected')
        // console.log(client);
    })


    // client.subscribe(`yl-home/${homeId}/+/report`, (err) => {
    //     if (err) console.error("Subscribe error:", err);
    //     else console.log("📡 Subscribed to device status");
    // });

    // client.on("message", (topic, message) => {
    //     console.log("📩 Message:", topic, message.toString());
    // });

    // client.on("error", (err) => {
    //     console.error("MQTT client error:", err.message);
    // });

    return client;
}
