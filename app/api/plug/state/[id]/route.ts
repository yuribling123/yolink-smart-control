import { getState } from "@/services/outlet/getState";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const state = await getState(id);

  return NextResponse.json(state);
}
