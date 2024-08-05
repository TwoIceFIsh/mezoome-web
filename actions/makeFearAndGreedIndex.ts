import db from "@/lib/prismadb";


// Constants
const FEAR_AND_GREED_URL = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

// Helper Functions
const fetchData = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
};


/**
 * getChartData 함수는 주어진 날짜 범위에 대해 `fear_and_greed_index`와 `mezoome_index` 데이터
 *를 가져와 날짜별로 결합하고, 주말이나 데이터가 없는 날에는 이전 데이터를 채워서
 * 연속적인 데이터 배열을 반환합니다.
 *
 * @returns {Promise<{ date: string; fgi: number; mezoome: number }[]>} 날짜별로 결합된 데이터 배열
 */
export const makeFearAndGreedIndex = async () => {
  // 모든 레코드 가져오기
  const fearAndGreedIndex = await fetchData(FEAR_AND_GREED_URL, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT
    }
  });
  console.log(fearAndGreedIndex.fear_and_greed_historical.data);

  // 데이터 변환 및 저장
  return transformAndStoreData(fearAndGreedIndex.fear_and_greed_historical.data);
};

interface InputData {
  x: number;  // timestamp
  y: number;  // prediction
  rating: string;  // rating (not used in transformation)
}

export const transformAndStoreData = async (data: InputData[]) => {
  // 데이터를 변환하여 Prisma 모델에 맞게 저장
  const transformedData = data.map(item => ({
    date: new Date(item.x),  // timestamp를 Date 객체로 변환
    index: item.y  // prediction을 index로 매핑
  }));

  // Prisma에서 date 필드를 유니크하지 않게 설정한 경우 처리 방법
  for (const { date, index } of transformedData) {
    // 날짜로 기존 레코드 검색
    const existingRecord = await db.fear_and_greed_index.findFirst({
      where: { date: date },
      orderBy: {
        date: "desc"
      }
    });

    if (existingRecord) {
      // 레코드가 존재하면 업데이트
      await db.fear_and_greed_index.update({
        where: { id: existingRecord.id },  // 기존 레코드의 id로 업데이트
        data: { index }
      });
    } else {
      // 레코드가 존재하지 않으면 새로 생성
      await db.fear_and_greed_index.create({
        data: { date, index }
      });
    }
  }

  return transformedData;
};