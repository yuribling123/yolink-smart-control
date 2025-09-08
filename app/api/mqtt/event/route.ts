import { NextRequest } from "next/server";
import { connectMqtt } from "@/lib/mqttClient";

function initMqtt(send: (msg: string) => void) {
  connectMqtt().then((client) => {
    client.on("message", (topic, message) => {
      const payload = JSON.stringify({
        topic,
        payload: message.toString(),
      });
      send(payload); // 👈 directly call the one listener
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

      // 👇 Send an initial event immediately
      controller.enqueue(encoder.encode(`data: {"status":"connected"}\n\n`));


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
