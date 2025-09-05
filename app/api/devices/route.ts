import { NextResponse } from "next/server";
import { getDeviceList } from "@/services/devices";

export async function GET() {
  const devices = await getDeviceList();
  return NextResponse.json(devices);
}
