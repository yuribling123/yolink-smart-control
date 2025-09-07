"use client";
import { useEffect, useState } from "react";

export default function MessageViewer() {
    const [message, setMessage] = useState<any>();

    useEffect(() => {
        const sse = new EventSource("/api/mqtt/event");

        sse.onmessage = (event) => {
            const outer = JSON.parse(event.data);
            const inner = JSON.parse(outer.payload);
            setMessage(inner); // save raw message

        };

        return () => sse.close();
    }, []);



    return (
       <div className="w-72 min-h-[160px] flex flex-col items-start m-6 bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-md">
  <h2 className="font-semibold mb-4 text-gray-900 text-base">
   Message Box
  </h2>

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
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            message.data.state === "open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.data.state}
        </span>
      </p>
    </div>
  ) : (
    <p className="text-gray-400 text-sm italic">No messages yet...</p>
  )}
</div>

    );
}
