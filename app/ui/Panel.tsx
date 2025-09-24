"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAutomationStore } from "@/store/AutoStore";
import { useDeviceStore } from "@/store/DeviceStore";
import { HomeIcon, ZapIcon } from "lucide-react";


export default function Panel() {

  const { enabled } = useAutomationStore();
  const { setEnabled } = useAutomationStore();
  const { addRule, rules, resetRules } = useAutomationStore();
  const devices = useDeviceStore((s) => s.devices);
  const sensor = Object.values(devices).find((d) => d.type === "THSensor");
  const temperature = sensor?.info?.state;
  // console.log("temp",temperature )
  // console.log("devices",devices )






  // Add a test rule: Door closed → turn plug off
  function addDoorRule() {
    addRule({
      id: "door-close", // ✅ short name instead of nanoid
      trigger: { event: "DoorSensor.Alert", state: "closed" },
      action: { deviceType: "Outlet", state: "close" },
    });
    addRule({
      id: "door-open", // ✅ short name instead of nanoid
      trigger: { event: "DoorSensor.Alert", state: "open" },
      action: { deviceType: "Outlet", state: "open" },
    });
    addRule({
      id: "door-open-speaker",
      trigger: { event: "DoorSensor.Alert", state: "open" },
      action: { deviceType: "SpeakerHub", state: `Welcome Home! Current temperature is ${temperature ?? "26"}°C`,}, // 👈 adjust state as needed
    });
    addRule({
      id: "door-close-speaker",
      trigger: { event: "DoorSensor.Alert", state: "closed" },
      action: { deviceType: "SpeakerHub", state: "I Will Keep the House Safe" }, // 👈 adjust state as needed
    });



  }

  return (

    <div className="w-90 h-[230px] flex flex-col m-6 bg-gradient-to-br from-gray-50 to-white border rounded-2xl p-3 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <HomeIcon size={18} /> Smart Home
        </h2>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>


      <div className="mt-4 overflow-y-auto flex-1 ">

        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-sm font-medium text-gray-700">Rules</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${enabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {enabled ? "Automations Active" : "Automations Off"}
          </span>
        </div>


        {rules.length === 0 ? (
          <p className="text-sm text-gray-400">No rules yet. Add one below 👇</p>
        ) : (
          <ul className="space-y-1">
            {rules.map((r) => (
              <li key={r.id} className="flex items-center gap-2 text-sm">
                <ZapIcon size={14} className="text-blue-500" />
                {r.trigger.state === "open" ? "Door Open" : "Door Close"} → {r.action.deviceType} {r.action.state}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <Button size="sm" variant="ghost" onClick={addDoorRule} className="cursor-pointer">➕ Add Rule</Button>
        <Button size="sm" variant="ghost" onClick={resetRules} className="cursor-pointer">🗑 Clear All</Button>
      </div>
    </div>


  );
}
