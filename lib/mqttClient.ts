import * as mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid";
import { ensureToken } from "@/services/token";

let client: mqtt.MqttClient;

export async function connectMqtt() {

    if (client) return client; // reuse if already connected

    const token = await ensureToken();
    const homeId = process.env.YOLINK_HOME_ID;
    // wait for 10 seconds 
    client = mqtt.connect("mqtt://api.yosmart.com:8003", {
        username: token,
        clientId: uuidv4(),
    });

    client.on('connect', function () {
        console.log('🟢 Connected')
    })

    client.subscribe(`yl-home/${homeId}/+/report`, (err) => {
        if (err) console.error("Subscribe error:", err);
        else console.log("📡 Subscribed");
    });

    // log every message received
    client.on("message", (topic, message) => {
        console.log("📩 Incoming MQTT Message");
        console.log("Topic:",topic);
        console.log("Payload:",message.toString());
    });







    // client.on("error", (err) => {
    //     console.error("MQTT client error:", err.message);
    // });

    return client;
}
