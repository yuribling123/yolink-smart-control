

import { getToken } from "../token";
import { getDeviceList } from "../devices";

const API = "https://api.yosmart.com/open/yolink/v2/api"

export async function getState(deviceId: string) {
    const ACCESS_TOKEN = await getToken();
    const devList = await getDeviceList();
    const DEVICE_TOKEN = devList.data.devices[0].token;

    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ACCESS_TOKEN}`, // app-level JWT
        },
        body: JSON.stringify({
            method: "Outlet.getState",
            time: Date.now(),
            targetDevice: deviceId,
            token: DEVICE_TOKEN, // ✅ must be the device token, not ACCESS_TOKEN
        }),
    });

    return res.json();
}