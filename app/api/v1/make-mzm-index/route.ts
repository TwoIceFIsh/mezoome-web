import { NextResponse } from "next/server";
import { makeMezoomeIndex } from "@/actions/makeMezoomeIndex";
import db from "@/lib/prismadb";

export async function GET() {
  await makeMezoomeIndex();
  const result = await db.mezoome_index.findFirst({
    orderBy: {
      date: "desc"
    }
  });

  return NextResponse.json({ result: result });
}