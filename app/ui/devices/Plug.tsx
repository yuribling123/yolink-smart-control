"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InfoIcon, Loader2, Plug as PlugIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeviceStore } from "@/store/DeviceStore";

interface PlugProps {
    deviceId: string;
    name: string;
}

export default function Plug({ deviceId, name }: PlugProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOnLine, setIsOnLine] = useState(true);

    // pull device from Zustand store
    const device = useDeviceStore((s) => s.devices[deviceId]);
    const updateDevice = useDeviceStore((s) => s.updateDevice);
    const open = device?.state === "open";  // "open" or "close"/"closed"


    // check power and state
    // 🔍 Initial check: power first, then state
    useEffect(() => {
        async function fetchState() {
            try {
                setIsLoading(true)
                const res = await fetch(`/api/plug/state/${deviceId}`);
                const json = await res.json();
                //offline
                if (json.code === "000201") { //off line or busy (020104)message
                    setIsOnLine(false);
                    return
                }
                //online
                setIsOnLine(true)
                updateDevice(deviceId,{state:json.data.state })
            } catch (err) {
                console.log(err)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchState();
    }, [deviceId]);



    // // 🔌 Subscribe to SSE (listen to on/off or is online message)
    // useEffect(() => {
    //     const sse = new EventSource("/api/mqtt/event");
    //     sse.onmessage = (event) => {
    //         try {
    //             setIsLoading(true);
    //             const outer = JSON.parse(event.data);
    //             const data = JSON.parse(outer.payload);
    //             if (data.deviceId === deviceId) {
    //                 setIsOnLine(true)
    //                 setIsOpen(data.data.state === "open");
    //             }
    //             setIsLoading(false);
    //         }
    //         catch (e) {

    //         }
    //         finally {
    //             setIsLoading(false)
    //         }

    //     };

    //     return () => {
    //         sse.close(); // cleanup on unmount
    //     };
    //     ;
    // }, [deviceId]);

    async function handleToggle(newState: boolean) {
        if (isLoading) return;
        setIsLoading(true);

        fetch(`/api/plug/trigger/${deviceId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: newState ? "open" : "close" }),
        })
            .then(async (res) => {
                const json = await res.json();
                if (json.result.desc != "Success") {
                    throw new Error(json.result.desc);
                }
                updateDevice(deviceId,{state: newState? "open" : "closed"})
                toast.success(newState ? "Turned ON" : "Turned OFF");
            })
            .catch((e) => {
                toast.error(e.message);
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >
            <PlugIcon size={40} className={open ? "text-green-500" : "text-gray-400"} />

            <Tooltip>
                <TooltipTrigger><h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2></TooltipTrigger>
                <TooltipContent side="right">
                    <p>1200w</p>
                </TooltipContent>
            </Tooltip>


            <p className="text-sm text-gray-500">ID: {deviceId}</p>

            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                :
                <>

                    {isOnLine ? <Switch checked={open} onCheckedChange={handleToggle} disabled={isLoading || !isOnLine} /> : (
                        <p className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-500 ">
                            Offline
                        </p>
                    )}


                </>}


        </div>

    );
}
