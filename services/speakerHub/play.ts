import { getDeviceList } from "../devices";
import { getToken } from "../token";

const API = process.env.YOLINK_API!;

export async function play(deviceId: string, message: string) {
  const ACCESS_TOKEN = await getToken();
  const devList = await getDeviceList();
  const device = devList.data.devices.find((d: any) => d.deviceId === deviceId);

  if (!device) {
    throw new Error(`Device with ID ${deviceId} not found`);
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`, // app-level JWT
    },
    body: JSON.stringify({
      method: "SpeakerHub.playAudio",
      time: Date.now(),
      targetDevice: deviceId,
      token: device.token,
      params: {
        tone: "Alert",
        message,        // 👈 now dynamic
        volume: 1,
        repeat: 0,
      },
    }),
  });

  return res.json();
}
