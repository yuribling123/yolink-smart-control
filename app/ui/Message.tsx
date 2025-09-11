"use client";
import { useMessageStore } from "@/store/MessageStore";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function MessageViewer() {
  const [connected, setConnected] = useState(false);
  const message = useMessageStore((s) => s.message);

  useEffect(() => {

    setConnected(true)

  }, []);


  return (

    <div className="w-72 min-h-[160px] flex flex-col items-start m-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-md">
      <div className="flex gap-2">
        <h2 className="font-semibold mb-4 text-gray-900 text-base">
          Message Box
        </h2>

        {connected ? (
          <Wifi size={20} />
        ) : (
          <WifiOff size={20} />
        )}

      </div>

      {message ? (
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <p>
            <span className="font-medium text-gray-600">Device ID:</span>{" "}
            <span className="font-mono">{message.deviceId}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Time:</span>{" "}
            {new Date(message.time).toLocaleString()}
          </p>
          <p>
            <span className="font-medium text-gray-600">State:</span>{" "}
            <span
              className="px-1 rounded-full text-xs font-semibold "
            >
              {message.state}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm italic">No messages yet...</p>
      )}
    </div>
  );
}
