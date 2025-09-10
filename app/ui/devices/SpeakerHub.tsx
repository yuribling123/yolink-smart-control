"use client"
import { DoorOpen, DoorClosed, Loader2, Speaker, VolumeX, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SpeakerHubProps {
  deviceId: string;
  name: string;
}

const SpeakerHub = ({ deviceId, name }: SpeakerHubProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnLine, setIsOnLine] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(false);



  useEffect(() => {
    async function fetchState() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/speaker/${deviceId}/state`);
        const json = await res.json();
        if (json.code === "000201") { //off line or busy (020104)message
          setIsOnLine(false);
          return
        }

        setIsOnLine(true)
        setIsMute(json.data.options.mute)
        console.log(json)
      } catch (err) {
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchState();
  }, [deviceId]);

  // useEffect(() => {
  //   const sse = new EventSource("/api/mqtt/event");

  //   sse.onmessage = (event) => {
  //     try {
  //       setIsLoading(true)
  //       const outer = JSON.parse(event.data);
  //       const payload = JSON.parse(outer.payload)
  //       // if (payload.deviceId === deviceId && payload.event === "SpeakerHub.Alert") {
  //       //   setIsOnLine(true)

  //       //   setIsLoading(false)
  //       // }
  //       setIsLoading(false)
  //     } catch (e) {
  //       console.log(e)
  //       setIsLoading(false)
  //     }
  //   };

  //   return () => {
  //     sse.close(); // cleanup on unmount
  //   };


  // }, [deviceId]);

  async function play() {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/speaker/${deviceId}/play`);

      const json = await res.json();

      if (json.desc !== "Success") {
        throw new Error(json.result?.des);
      }
      toast.success("Playing audio...");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }







  return (
    <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >

      <Speaker size={40} />


      <h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2>

      <p className="text-sm text-gray-500">ID: {deviceId}</p>


      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        :
        <>

          {isOnLine ? (
            <>

              {isMute ? <VolumeX size={24} color="red" /> : <Volume2 size={24} onClick={play} className="cursor-pointer hover:text-blue-800" />}

            </>





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

export default SpeakerHub;