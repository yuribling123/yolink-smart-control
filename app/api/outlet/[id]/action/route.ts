import { controlPlug } from "@/services/outlet/plug";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;

    // body parsing
    const { state }: { state: "open" | "close" } = await request.json();

    const result = await controlPlug(id, state);

    return NextResponse.json({ result });
  }
  catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message || "Error" },
      { status: 500 }
    );


  }
}
