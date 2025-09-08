"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plug as PlugIcon } from "lucide-react";

interface PlugProps {
    deviceId: string;
    name: string;
}

export default function Plug({ deviceId, name }: PlugProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 🔌 Subscribe to SSE
    useEffect(() => {
        const sse = new EventSource("/api/mqtt/event");

        sse.onmessage = (event) => {
            const outer = JSON.parse(event.data);
            const data = JSON.parse(outer.payload);

            if (data.deviceId === deviceId) {
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
        <div className=" bg-gray-50  border-gray-200 rounded-2xl shadow p-8 flex flex-col items-center gap-5 ">
            <PlugIcon size={40} className={isOpen ? "text-green-500" : "text-gray-400"} />
            <h2 className="font-semibold ">{name}</h2>
            <p className="text-sm text-gray-500">ID: {deviceId}</p>
            <Switch checked={isOpen} onCheckedChange={handleToggle} disabled={isLoading} />
        </div>

    );
}
