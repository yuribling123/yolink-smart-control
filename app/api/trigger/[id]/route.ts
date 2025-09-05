import { NextRequest, NextResponse } from "next/server";
import { controlPlug } from "@/services/plug";


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { state }: { state: "open" | "close" } = await req.json();

  const result = await controlPlug(params.id, state);

  return NextResponse.json({
    result,
  });

}