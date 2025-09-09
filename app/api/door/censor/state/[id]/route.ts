import { getState } from "@/services/doorSensor/getState";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params;
    const state = await getState(id);

    return NextResponse.json(state);
  }
  catch (e: any) {

    return NextResponse.json(
      { success: false, error: e.message || "Error" },
      { status: 500 }
    )

  }

}
