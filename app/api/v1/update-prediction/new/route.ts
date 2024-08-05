import { NextResponse } from "next/server";
import { newPredictions } from "@/actions/update/new-predictions";
import db from "@/lib/prismadb";

export async function GET() {

  await newPredictions();
  const data = await db.mezoome_index.findFirst({
    orderBy: {
      date: "desc"
    }
  });
  return NextResponse.json({ result: data });
}