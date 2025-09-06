import { NextResponse } from "next/server";
import { getHome } from "@/services/home";

export async function GET() {
  const devices = await getHome();
  return NextResponse.json(devices);
}
