import { NextResponse } from "next/server";
import { makeFearAndGreedIndex } from "@/actions/makeFearAndGreedIndex";
import db from "@/lib/prismadb";

export async function GET() {
  await makeFearAndGreedIndex();
  const result = await db.fear_and_greed_index.findFirst({
    orderBy: {
      date: "desc"
    }
  });
  return NextResponse.json({ result: result });
}