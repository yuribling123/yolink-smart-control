import { ensureToken } from "./token";


const API = process.env.YOLINK_API!;

export async function getDeviceList() {
  const token = await ensureToken();

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      method: "Home.getDeviceList",
      time: Date.now(),
      token,
    }),
  });

  return res.json();
}
