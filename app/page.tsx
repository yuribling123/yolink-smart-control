"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function Home() {

  const [device, setDevice] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadDevice() {
      const res = await fetch("/api/devices");
      const data = await res.json();
      // Always use the first device (since you know it's a plug)
      setDevice(data.data.devices[0]);
    }

    loadDevice();
  }, []);


  async function handleToggle(newState: boolean) {
  if (!device) return;
  setIsOpen(newState);

  fetch(`/api/trigger/${device.deviceId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state: newState ? "open" : "close" }),
  })
    .then(async (res) => {
      const data = await res.json();
      toast.success("success");
    })
    .catch((e) => {
      toast.error(`failed: ${e.message}`);
      setIsOpen(!newState); // revert if it failed
    });
}



  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        {device ? (
          <>
            <div className="font-semibold text-gray-800">{device.name}</div>
            <div className="font-semibold text-violet-950">Device ID: {device.deviceId}</div>

            <div className="flex items-center">
              <span className="mr-3">Trigger :</span>
              <Switch  checked={isOpen} onCheckedChange={handleToggle}/>
            </div>
          </>
        ) : (
          <div>Loading plug...</div>
        )}



      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
