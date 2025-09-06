import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
//   const state = await getPlugState(id);

//   return NextResponse.json(state);
}
