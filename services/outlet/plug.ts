import { getToken } from "../token";
import { getDeviceList } from "../devices";

const API = "https://api.yosmart.com/open/yolink/v2/api";

export async function controlPlug(deviceId: string, state: "open" | "close") {
  const ACCESS_TOKEN = await getToken();
  const devList = await getDeviceList();

  // 🔍 Find the device by ID
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
      method: "Outlet.setState",
      time: Date.now(),
      targetDevice: deviceId,
      token: device.token, // ✅ correct token for the device
      params: { state },   // "open" or "close"
    }),
  });

  return res.json();
}
