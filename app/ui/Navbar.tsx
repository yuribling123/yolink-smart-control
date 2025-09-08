"use client"
import { getDeviceList } from "@/services/devices";

import { useEffect, useState } from "react";

const NavBar = () => {
  const [HomeName, setHomeName] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/home")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const homeId = data?.data?.id;
        setHomeName(homeId ? homeId.slice(-4) : "");
      })
      .catch((error) => {
        console.error("Failed to fetch home data:", error);
      });

  }, []);


  return (
    <div
      className="
        sticky top-0 z-50
        flex items-center
        px-9 py-6
        bg-gray-2 dark:bg-gray-900/50
        backdrop-blur-md
        border-b border-gray-200/50 dark:border-gray-700/50
      "
    >
      {/* Brand name */}
      <span className="text-xl font-bold tracking-wide text-cyan-900 dark:text-white">
        YoLink
      </span>

      {/* Username on far right */}
      <span className="ml-auto text-gray-700 dark:text-gray-200 font-medium">
        Welcome Home, ID : **{HomeName ?? "Loading..."}
      </span>
    </div>

  );
}

export default NavBar;