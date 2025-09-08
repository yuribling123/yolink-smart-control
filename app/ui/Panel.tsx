"use client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"; // shadcn switch

const Panel = () => {
  const [enabled, setEnabled] = useState(false);

  async function handleToggle(value: boolean) {
    setEnabled(value);
    try {
    } catch (err) {
    }
  }

  return (
    <div className="w-72 min-h-[160px] flex flex-col items-start m-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
      <div className="flex flex-col gap-2 w-full">
        {/* Header */}
        <div className="flex  items-center justify-between w-full">
          <h2 className="font-semibold text-gray-900 text-base">Smart Home</h2>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
        </div>

        {/* Status */}
        <div className=" py-2 text-sm text-gray-600">
          {enabled ? "Automations are active" : "Automations are off"}
        </div>

         <div className=" text-sm text-gray-600">
          Leave the house → Turn off the plug.
        </div>

      </div>
    </div>
  );
};

export default Panel;
