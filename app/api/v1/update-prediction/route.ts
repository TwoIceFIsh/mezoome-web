import { NextResponse } from "next/server";

export async function GET() {

  // await updatePrediction();
  return NextResponse.json({ result: true });
}