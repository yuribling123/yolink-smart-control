
import { getState } from "@/services/speakerHub/getState";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params;
    const result = await getState(id);

    return NextResponse.json(result);
  } catch (e: any) {

    return NextResponse.json(
      { success: false, error: e.message || "Error" },
      { status: 500 }
    )
  }
}