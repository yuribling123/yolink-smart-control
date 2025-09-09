import { NextResponse } from "next/server";
import { getHome } from "@/services/home";

export async function GET() {
  try {
    const devices = await getHome();
    return NextResponse.json(devices);
  }
  catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Error" },
      { status: 500 }
    )
  }
}
