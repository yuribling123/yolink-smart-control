"use client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"; // shadcn switch
import { useAutomationStore } from "@/store/AutoStore";
import { useDeviceStore } from "@/store/DeviceStore";


interface PanelProps {
  devices: any[]
}
const Panel = ({ devices }: PanelProps) => {
  const plug = devices.find(d => d.type === "Outlet")
  const plug_id = plug?.deviceId
  const enabled = useAutomationStore((s) => s.enabled);
  const setEnabled = useAutomationStore((s) => s.setEnabled);

  const device = useDeviceStore((s) => s.devices[plug_id]);
  const updateDevice = useDeviceStore((s) => s.updateDevice);





  useEffect(() => {
    const sse = new EventSource("/api/mqtt/event");

    sse.onmessage = (event) => {

      if (!event.data) {
        return;
      }
      const outer = JSON.parse(event.data);
      if (!outer.payload) {
        return;
      }
      const payload = JSON.parse(outer.payload);

      if (enabled && payload.event == "DoorSensor.Alert" && payload.data?.state == "closed") {

        if (!plug) { return }

        turnOffPlug(plug_id)
      }
      else if (enabled && payload.event == "DoorSensor.Alert" && payload.data?.state == "open") {
        if (!plug) { return }

        turnOnPlug(plug_id)

      }

    };
    return () => {
      sse.close(); // cleanup on unmount
    };


  }, [devices]);



  function turnOffPlug(plugId: string) {
    fetch(`/api/plug/trigger/${plugId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "close" }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (json.result.desc != "Success") {
          throw new Error(json.result.desc);
        }
        updateDevice(plug_id, { state: "closed" })


      })
      .catch((e) => {

      })
      .finally();
  }

  function turnOnPlug(plugId: string) {
    fetch(`/api/plug/trigger/${plugId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "open" }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (json.result.desc != "Success") {
          throw new Error(json.result.desc);
        }
        updateDevice(plug_id, { state: "open" })


      })
      .catch((e) => {

      })
      .finally();
  }





  return (
    <div className="w-72 min-h-[160px] flex flex-col items-start m-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
      <div className="flex flex-col gap-2 w-full">
        {/* Header */}
        <div className="flex  items-center justify-between w-full">
          <h2 className="font-semibold text-gray-900 text-base">Smart Home</h2>
          <Switch checked={enabled} onCheckedChange={(value) => setEnabled(value)} />
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
