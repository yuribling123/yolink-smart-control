"use client"
import { AlarmClock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PowerFailureAlarmProps {
    deviceId: string;
    name: string;
}

const PowerFailureAlarm = ({ deviceId, name }: PowerFailureAlarmProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOnLine, setIsOnLine] = useState<boolean>(false);


    useEffect(() => {
        async function fetchState() {
            try {
                setIsLoading(true)
                const res = await fetch(`/api/PowerFailureAlarm/${deviceId}/state`);
                const json = await res.json();

                if (json.code === "000201") { //off line or busy (020104)message
                    setIsOnLine(false);
                    return
                }
                setIsOnLine(true)

            } catch (err) {
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchState();
    }, [deviceId]);



    return (
        <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >

            <AlarmClock size={40}></AlarmClock>


            <h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2>

            <p className="text-sm text-gray-500">ID: {deviceId}</p>


            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                :
                <>

                    {isOnLine ? (
                        <>
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

export default PowerFailureAlarm;