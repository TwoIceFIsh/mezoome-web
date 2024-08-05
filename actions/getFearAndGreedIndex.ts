import db from "@/lib/prismadb";
import { getRating } from "@/actions/getMezoomeIndex";


export default async function getFearAndGreedIndex() {

  const todayIndex = await db.fear_and_greed_index.findFirst({
    orderBy: {
      date: "desc"
    }
  });

  return {
    score: todayIndex?.index as number,
    rating: getRating(todayIndex?.index as number),
    timestamp: todayIndex?.date
  };
}