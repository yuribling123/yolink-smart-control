"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAutomationStore } from "@/store/AutoStore";


export default function Panel() {
  const {enabled} = useAutomationStore();
  const { setEnabled } = useAutomationStore();
  const { addRule, rules, resetRules } = useAutomationStore();


  // Add a test rule: Door closed → turn plug off
  function addDoorCloseRule() {
    addRule({
      id: "door-close", // ✅ short name instead of nanoid
      trigger: { event: "DoorSensor.Alert", state: "closed" },
      action: { deviceType: "Outlet", state: "close" },
    });
    console.log(rules
    )
  }

  // Add a test rule: Door open → turn plug on
  function addDoorOpenRule() {
    addRule({
      id: "door-open", // ✅ short name instead of nanoid
      trigger: { event: "DoorSensor.Alert", state: "open" },
      action: { deviceType: "Outlet", state: "open" },
    });
    console.log("added rule")
    console.log(rules
    )
  }

  return (
    <div className="w-72 min-h-[160px] flex flex-col items-start m-6 bg-white border rounded-2xl p-5 shadow-md">
      <div className="flex items-center justify-between w-full mb-2">
        <h2 className="font-semibold text-gray-900 text-base">Smart Home</h2>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className="py-2 text-sm text-gray-600">
        {enabled ? "Automations are active" : "Automations are off"}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Button size="sm" onClick={addDoorCloseRule}>
          Add Close Rule
        </Button>
        <Button size="sm" onClick={addDoorOpenRule}>
          Add Open Rule
        </Button>
        <Button size="sm" onClick={resetRules}>
          Clear All Rule
        </Button>
      </div>
    </div>
  );
}
