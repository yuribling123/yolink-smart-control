"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // shadcn switch
interface PanelProps {
  devices: any[]
}
const Panel = ({ devices }: PanelProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  // Find devices dynamically


  // useEffect(() => {
  //   const sse = new EventSource("/api/mqtt/event");

  //   sse.onmessage = (event) => {

  //     if (!event.data) {
  //       return;
  //     }
  //     const outer = JSON.parse(event.data);
  //     if (!outer.payload) {
  //       return;
  //     }
  //     const payload = JSON.parse(outer.payload);

  //     if (isEnabled && payload.event == "DoorSensor.Alert" && payload.data?.state == "closed") {
  //       const plug = devices.find(d => d.type === "Outlet")
  //       const plug_id = plug.deviceId
  //       turnOffPlug(plug_id)
  //     }
  //     else if (isEnabled && payload.event == "DoorSensor.Alert" && payload.data?.state == "open") {
  //       const plug = devices.find(d => d.type === "Outlet")
  //       const plug_id = plug.deviceId
  //       turnOnPlug(plug_id)

  //     }

  //   };
  //   return () => {
  //     sse.close(); // cleanup on unmount
  //   };


  // }, [isEnabled]);



  function turnOffPlug(plugId: string) {
    fetch(`/api/plug/trigger/${plugId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "close" }),
    });
  }

  function turnOnPlug(plugId: string) {
    fetch(`/api/plug/trigger/${plugId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "open" }),
    });
  }





  return (
    <div className="w-72 min-h-[160px] flex flex-col items-start m-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
      <div className="flex flex-col gap-2 w-full">
        {/* Header */}
        <div className="flex  items-center justify-between w-full">
          <h2 className="font-semibold text-gray-900 text-base">Smart Home</h2>
          <Switch checked={isEnabled} onCheckedChange={(value) => setIsEnabled(value)} />
        </div>

        {/* Status */}
        <div className=" py-2 text-sm text-gray-600">
          {isEnabled ? "Automations are active" : "Automations are off"}
        </div>

        <div className=" text-sm text-gray-600">
          Leave the house → Turn off the plug.
        </div>

      </div>
    </div>
  );
};

export default Panel;
