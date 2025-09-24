"use client"
import { useDeviceStore } from "@/store/DeviceStore";
import { Loader2, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface THSensorProps {
  deviceId: string;
  name: string;
}

const THSensor = ({ deviceId, name }: THSensorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [IsOnLine, setIsOnLine] = useState<boolean>(true);

  // pull device from Zustand store
  const device = useDeviceStore((s) => s.devices[deviceId]);
  const updateDevice = useDeviceStore((s) => s.updateDevice);
  // const open = device?.state === "open";  // "open" or "close"/"closed"


  useEffect(() => {
    async function loadState() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/thsensor/${deviceId}/state`);
        const json = await res.json();
        //offline
        if (json.code === "000201" || json.code === "020104") { //off line or busy (020104)message
          setIsOnLine(false);
          return;
        }
        //online
        setIsOnLine(json.data?.online);
    
        updateDevice(deviceId, {
          type: "THSensor",
          info: {
            state: json.data?.state?.state,
            temperature: json.data?.state?.temperature,
            humidity: json.data?.state?.humidity,
          },
        }); // double check 

      } finally {
        setIsLoading(false);
      }
    }
    loadState();
  }, [deviceId]);








  return (
    <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >
      <Thermometer size={40}></Thermometer>

      <h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2>

      <p className="text-sm text-gray-500">ID: {deviceId}</p>




      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        :
        <>

          {IsOnLine ? (
            <p
              className="px-3 py-1 rounded-full text-xs font-medium border gap-2"
            >
              <span>{device?.info?.temperature}°C </span>
              <span className="text-gray-500 px-2">|</span>
              <span>{device?.info?.humidity}%</span>

            </p>
          ) : (
            <p className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-500 ">
              Offline
            </p>
          )}

        </>
      }

    </div>


  );
}

export default THSensor;