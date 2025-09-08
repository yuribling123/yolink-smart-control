"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { InfoIcon, Plug as PlugIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PlugProps {
    deviceId: string;
    name: string;
}

export default function Plug({ deviceId, name }: PlugProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [watt, setWatt] = useState(1200);

    // check power and state
    // 🔍 Initial check: power first, then state
    useEffect(() => {
        async function fetchState() {
            try {
                const res = await fetch(`/api/state/${deviceId}`);
                const json = await res.json();

                if (json.code === "000000") {
                    const power = json.data?.power ?? 0;
                    const watt = json.data?.watt ?? 0;
                    const state = json.data?.state;
                    setIsOn(true);
                    setIsOpen(state === "open");;
                }

            } catch (err) {
                console.error("Failed to fetch plug state", err);
            }
        }
        fetchState();
    }, [deviceId]);



    // 🔌 Subscribe to SSE
    useEffect(() => {
        const sse = new EventSource("/api/mqtt/event");

        sse.onmessage = (event) => {
            const outer = JSON.parse(event.data);
            if (outer.status === "connected") {
                console.log("👋 connection start");
                return;
            }
            const data = JSON.parse(outer.payload);

            if (data.deviceId === deviceId) {
                setIsOn(true)
                setIsOpen(data.data.state === "open");
                setIsLoading(false);
            }
        };

        return () => sse.close();
    }, [deviceId]);

    async function handleToggle(newState: boolean) {
        if (isLoading) return;
        setIsLoading(true);
        setIsOpen(newState);

        fetch(`/api/trigger/${deviceId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: newState ? "open" : "close" }),
        })
            .then(async (res) => {
                await res.json();
                toast.success(newState ? "Turned ON" : "Turned OFF");
            })
            .catch((e) => {
                toast.error(`failed: ${e.message}`);
                setIsOpen(!newState); // revert if failed
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >
            <PlugIcon size={40} className={isOpen ? "text-green-500" : "text-gray-400"} />

            <Tooltip>
                <TooltipTrigger><h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2></TooltipTrigger>
                <TooltipContent side="right">
                    <p>{watt}w</p>
                </TooltipContent>
            </Tooltip>


            <p className="text-sm text-gray-500">ID: {deviceId}</p>
            {isOn ? <Switch checked={isOpen} onCheckedChange={handleToggle} disabled={isLoading || !isOn} /> : (
                <div className="  bg-red-400 text-white text-xs px-2 py-1 rounded-full top-10 right-10">
                    Offline
                </div>
            )}

        </div>

    );
}
