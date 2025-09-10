import { getDeviceList } from "../devices";
import { getToken } from "../token";

const API = process.env.YOLINK_API!;

export async function getState(deviceId: string) {
  const ACCESS_TOKEN = await getToken();
  const devList = await getDeviceList();
  const device = devList.data.devices.find(
    (d: any) => d.deviceId === deviceId
  );

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
      method: "Outlet.getState",
      time: Date.now(),
      targetDevice: deviceId,
      token: device.token, // ✅ correct device token
    }),
  });

  return res.json();
}
