"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Plug from "./ui/devices/Plug";
import DoorSensor from "./ui/devices/DoorSensor";
import DeviceList from "./ui/devices/DeviceList";
import MessageViewer from "./ui/Message";
import Panel from "./ui/Panel";
import Listener from "@/components/sse/listener";

export default function Home() {
  const [devices, setDevices] = useState<any[]>([]);



  useEffect(() => {
    async function loadDevices() {
      const res = await fetch("/api/devices");
      const data = await res.json();

      if (data.data.devices && data.data.devices.length > 0) {
        setDevices(data.data.devices);
      } else {
        setDevices([]);
      }
    }
    loadDevices();
  }, []); // ✅ only run once on mount


  return (
    <div>
      <Listener  devices={devices}  /> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        <MessageViewer />
        <Panel/>
      </div>
      <DeviceList devices={devices}></DeviceList>
    </div>

  );
}
