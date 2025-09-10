import { getDeviceList } from "../devices";
import { getToken } from "../token";

const API = "https://api.yosmart.com/open/yolink/v2/api";

export async function play(deviceId: string) {
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
            Authorization: `Bearer ${ACCESS_TOKEN}`, // your app-level JWT
        },
        body: JSON.stringify({
            method: "SpeakerHub.playAudio",
            time: Date.now(),
            targetDevice: deviceId,       // SpeakerHub deviceId
            token: device.token,          // SpeakerHub token
            params: {
                tone: "Alert",              // one of: "Emergency", "Alert", "Warn", "Tip"
                message: "i am stupid",    // optional TTS message
                volume: 5,                  // optional (use 1–10)
                repeat: 0                  // optional (0–10)
            }
        }),
    });


    return res.json();
}
