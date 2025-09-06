import { NextResponse } from "next/server";
import { getPlugState } from "@/services/plug";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const state = await getPlugState(id);

  return NextResponse.json(state);
}
