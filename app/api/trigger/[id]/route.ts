import { NextRequest, NextResponse } from "next/server";
import { controlPlug } from "@/services/plug";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  // body parsing
  const { state }: { state: "open" | "close" } = await request.json();

  const result = await controlPlug(id, state);

  return NextResponse.json({ result });
}
