// import { connectMqtt } from "@/lib/mqttClient";

// export async function GET() {
//     try {
//         const client = await connectMqtt(); // 👈 now you must await

//         // Wait until connected (if not already)
//         if (client.connected) {
//             return new Response("MQTT connected", { status: 200 });
//         }
//         return new Response("pending", { status: 202 });

//     } catch (err: any) {
//         return new Response(`MQTT connection failed: ${err.message}`, {
//             status: 500,
//         });
//     }
// }

