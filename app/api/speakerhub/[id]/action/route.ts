
import { getState } from "@/services/speakerHub/getState";
import { play } from "@/services/speakerHub/play";
import { NextResponse } from "next/server";


export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await context.params;
    const body = await request.json();
    const message = body.state;
    const result = await play(id,message);

    return NextResponse.json(result);
  } catch (e: any) {

    return NextResponse.json(
      { success: false, error: e.message || "Error" },
      { status: 500 }
    )
  }
}