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
                setHomeName(data?.data?.id.slice(-4));
            })
            .catch((error) => {
                console.error("Failed to fetch home data:", error);
            });

    }, []);


    return (
        <div className="py-5 backdrop-blur-sm bg-white/30 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 flex items-center px-5">
            {/* Brand name */}
            <span className="text-xl font-bold tracking-wide">
                Yolink
            </span>

            {/* Username on far right */}
            <span className="ml-auto text-gray-700 dark:text-gray-200 font-medium">
                Welcome Home, ID : **{HomeName ?? "Loading..."}
            </span>

        </div>

    );
}

export default NavBar;