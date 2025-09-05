import { ensureToken } from "./token";


const API = "https://api.yosmart.com/open/yolink/v2/api";

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
