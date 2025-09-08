import { DoorOpen, DoorClosed } from "lucide-react";
import { useState } from "react";

interface DoorSensorProps {
    deviceId: string;
    name: string;
    token: string;
}

const DoorSensor = ({ deviceId, name }: DoorSensorProps) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="rounded-2xl  p-8 flex flex-col items-center gap-5 transition bg-gray-50" >
            {isOpen ? (
                <DoorOpen  size={40} />
            ) : (
                <DoorClosed size={40} />
            )}


            <h2 className="font-semibold flex gap-2 hover:text-indigo-900 cursor-pointer ">{name} </h2>

            <p className="text-sm text-gray-500">ID: {deviceId}</p>


        </div>


    );
}

export default DoorSensor;