"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Plug from "./ui/devices/Plug";

export default function Home() {
  const [device, setDevice] = useState<any | null>(null);



  useEffect(() => {
    async function loadDevice() {
      const res = await fetch("/api/devices");
      const data = await res.json();
      setDevice(data.data.devices[0] ?? null);
    }
    loadDevice();
  }, []);


  return (

    <>
      <div className="py-5 px-10 backdrop-blur-sm bg-white/30 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 flex items-center ">
        <span className=" text-xl font-bold tracking-wide">
          My Smart Home
        </span>
      </div>

      {device ?
        <div className="m-10 grid md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-4 ">
          <Plug deviceId={device.deviceId} name={device.name} />

        </div> :

        <></>}

    </>


  );
}
