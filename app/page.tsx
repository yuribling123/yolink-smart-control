"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Plug from "./ui/devices/Plug";
import DoorSensor from "./ui/devices/DoorSensor";

export default function Home() {
  const [devices, setDevices] = useState<any[]>([]);



  useEffect(() => {
    async function loadDevices() {
      const res = await fetch("/api/devices");
      const data = await res.json();

      if (data.data.devices && data.data.devices.length > 0) {
        setDevices(data.data.devices);
        console.log(data.data.devices[0]);
      } else {
        setDevices([]);
      }
    }
    loadDevices();
  }, []); // ✅ only run once on mount


  return (

    <>
      <div className="py-5 px-10 backdrop-blur-sm bg-white/30 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 flex items-center ">
        <span className=" text-xl font-bold tracking-wide">
          My Smart Home
        </span>
      </div>

      {devices.length > 0 ? (
        <div className="m-10 grid md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-4 ">
          {devices.map((device) => {
            switch (device.type) {
              case "Outlet":
                return (
                  <Plug
                    key={device.deviceId}
                    deviceId={device.deviceId}
                    name={device.name}
                  />
                );

              case "DoorSensor":
                return (
                  <DoorSensor
                    key={device.deviceId}
                    deviceId={device.deviceId}
                    name={device.name}
                    token={device.token}
                  />
                );

              default:
                return null; // 👈 ignore unsupported device types for now
            }
          })}
        </div>
      ) : (
        null
      )}
    </>








  );
}
