import { DoorOpen, DoorClosed, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DoorSensorProps {
  deviceId: string;
  name: string;
  token: string;
}

const DoorSensor = ({ deviceId, name }: DoorSensorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [onLine, setOnLine] = useState<boolean>(false);
  const [isOpen, setisOpen] = useState<boolean>(false);


  useEffect(() => {
    async function loadState() {
      setIsLoading(true)
      const res = await fetch(`/api/door/censor/state/${deviceId}`);
      const json = await res.json();
      setOnLine(json.data?.online);
      setisOpen(json.data?.state?.state === "open");
      setIsLoading(false)
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
          setOnLine(true)
          setisOpen(payload.data.state === "open");
          setIsLoading(false)
        }
        setIsLoading(false)
      } catch (e) {
        toast.error("failed");
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

          {onLine ? (
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