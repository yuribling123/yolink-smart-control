import { NextRequest } from "next/server";
import { connectMqtt } from "@/lib/mqttClient";

function initMqtt(send: (msg: string) => void) {
  connectMqtt().then((client) => {
    // 🟢 MQTT connected
    client.on("connect", () => {
      send(JSON.stringify({ status: "mqtt_connected" }));
    });

    // 🔴 MQTT error
    client.on("error", (err) => {
      send(JSON.stringify({ status: "mqtt_error", error: err.message }));
    });

    // ⚪️ MQTT disconnected
    client.on("close", () => {
      send(JSON.stringify({ status: "mqtt_disconnected" }));
    });

    // 📩 Device messages
    client.on("message", (topic, message) => {
      const payload = JSON.stringify({
        topic,
        payload: message.toString(),
      });
      send(payload);
    });
  });
}


export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let alive = true; // track connection

  const stream = new ReadableStream({
    start(controller) {
      const send = (msg: string) => {
        if (!alive) return; // stream has close
        try {
          controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
        } catch (e) {
          console.warn("⚠️ Failed to send to closed SSE:", e);
        }
      };

   
      initMqtt(send);

      req.signal.addEventListener("abort", () => {
        alive = false; // mark closed
        console.log("🔌 SSE client disconnected");
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
