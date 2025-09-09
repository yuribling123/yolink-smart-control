"use client"
import { DoorOpen, DoorClosed, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DoorSensorProps {
  deviceId: string;
  name: string;
}

const DoorSensor = ({ deviceId, name }: DoorSensorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [IsOnLine, setIsOnLine] = useState<boolean>(true);
  const [isOpen, setisOpen] = useState<boolean>(false);


  useEffect(() => {
    async function loadState() {
      try {
        setIsLoading(true)
        console.log("json")
        const res = await fetch(`/api/door/censor/state/${deviceId}`);
        const json = await res.json();
        if (json.code === "000201" || json.code === "020104") { //off line or busy (020104)message
          console.log("json",json)
          console.log("here",json.code)
          setIsOnLine(false);
          return;
        }

        setIsOnLine(json.data?.online);
        setisOpen(json.data?.state?.state === "open");

      } finally {
        setIsLoading(false);
      }
    }
    loadState();
  }, [deviceId]);


  useEffect(() => {
    const sse = new EventSource("/api/mqtt/event");

    sse.onmessage = (event) => {
      try {
        setIsLoading(true)
        const outer = JSON.parse(event.data);
        const payload = JSON.parse(outer.payload)
        if (payload.deviceId === deviceId && payload.event === "DoorSensor.Alert") {
          setIsOnLine(true)
          setisOpen(payload.data.state === "open");
        }
      } catch (e) {
      }
      finally{
        setIsLoading(false)
      }
    };

    return () => {
      sse.close(); // cleanup on unmount
    };


  }, [deviceId]);








  return (
    <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >
      {isOpen ? (
        <DoorOpen size={40} />
      ) : (
        <DoorClosed size={40} />
      )}


      <h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2>

      <p className="text-sm text-gray-500">ID: {deviceId}</p>


      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        :
        <>

          {IsOnLine ? (
            <p
              className={`px-3 py-1 rounded-full text-xs font-medium border ${isOpen
                ? "bg-white text-black border-gray-400"
                : "bg-gray-200 text-gray-700 border-gray-400"
                }`}
            >
              {isOpen ? "Open" : "Closed"}
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

export default DoorSensor;