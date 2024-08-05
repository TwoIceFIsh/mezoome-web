import db from "@/lib/prismadb";


interface PredictionsResponse {
  predictions: number[];
}

// Constants
const MEZOOME_PREDICTION_URL = "https://api.mezoo.me/predict";
const ARTICLE_TAKE_LIMIT = 150;

// Helper Functions
const fetchData = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
};

export const getRating = (average: number): string => {
  if (average > 75) return "EXTREME GREED";
  if (average > 55) return "GREED";
  if (average > 45) return "NEUTRAL";
  if (average > 25) return "FEAR";
  return "EXTREME FEAR";
};

export const getMezoomeIndex = async () => {

  const todayIndex = await db.mezoome_index.findFirst({
    orderBy: {
      date: "desc"
    }
  });

  return {
    score: todayIndex?.index as number,
    rating: getRating(todayIndex?.index as number),
    timestamp: todayIndex?.date
  };

};