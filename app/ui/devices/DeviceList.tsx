"use client";
import Plug from "./Plug";
import DoorSensor from "./DoorSensor";
import SpeakerHub from "./SpeakerHub";

interface DeviceListProps {
    devices: any[];
}

const DeviceList = ({ devices }: DeviceListProps) => {
    return (
        <>
            {/* Header */}
            <div className="py-5 px-10 backdrop-blur-sm bg-white/30 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <span className="text-xl font-bold tracking-wide">
                    My Devices
                </span>
            </div>

            {/* Device Grid */}
            {devices && devices.length > 0 ? (
                <div className="m-10 grid md:grid-cols-4 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {devices.map((device) => {
                        switch (device.type) {
                            case "Outlet":
                                return (
                                    <Plug
                                        key={device.deviceId}
                                        deviceId={device.deviceId}
                                        name={device.name}
                                    />
                                );

                            case "DoorSensor":
                                return (
                                    <DoorSensor
                                        key={device.deviceId}
                                        deviceId={device.deviceId}
                                        name={device.name}   
                                    />
                                );

                            case "SpeakerHub":
                                return (
                                    <SpeakerHub
                                        key={device.deviceId}
                                        deviceId={device.deviceId}
                                        name={device.name}
                                    />
                                );

                            default:
                                return null;
                        }
                    })}
                </div>
            ) : (
                <div className="m-10 flex items-center justify-center min-h-[200px]">
                    <p className="text-gray-400 text-sm italic">wait</p>
                </div>
            )}
        </>
    );
};

export default DeviceList;
