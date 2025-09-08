import { controlPlug } from "@/services/outlet/plug";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest,
  context: { params: Promise<{id: string}> }
) {
  
  const { id } = await context.params;

  // body parsing
  const { state }: { state: "open" | "close" } = await request.json();

  const result = await controlPlug(id, state);

  return NextResponse.json({ result });
}
