import db from "@/lib/prismadb";

// 배치 크기 정의
const BATCH_SIZE = 1000;


// API에 전달할 데이터와 응답의 타입 정의
interface PredictResponse {
  predictions: string[];
}

// fetchPredictions 함수 타입 정의
const fetchPredictions = async (titles: string[]): Promise<PredictResponse> => {
  const response = await fetch("https://api.mezoo.me/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titles })
  });
  console.log(titles);
  return response.json();
};

export const newPredictions = async (): Promise<void> => {
  // 데이터베이스에서 기사 목록을 가져옵니다.
  const data = await db.mezoome_articles.findMany({
    select: {
      subject: true,
      writeDateTimestamp: true,
      articleId: true
    },
    orderBy: {
      articleId: "desc"
    },
    take: 100
  });

  // API 요청을 위한 제목 배열과 맵을 준비합니다.
  const titles: string[] = data.map(item => item.subject);
  const articleIdMap: Map<string, number> = new Map(data.map(item => [item.subject, item.articleId]));

  // 제목 배열을 500개씩 묶습니다.
  const chunks: string[][] = [];
  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    chunks.push(titles.slice(i, i + BATCH_SIZE));
  }

  // 각 청크에 대해 API 요청을 보내고 결과를 처리합니다.
  for (const chunk of chunks) {
    const result: PredictResponse = await fetchPredictions(chunk);
    const predictions: string[] = result.predictions;

    // 예측 값과 기사 ID를 매핑합니다.
    const updates = predictions.map((prediction, index) => {
      const title = chunk[index];
      const articleId = articleIdMap.get(title);
      return {
        where: { articleId },
        data: { prediction }
      };
    }).filter(update => update.where && update.data); // 필터를 사용하여 유효한 업데이트만 포함합니다.

    // 데이터베이스에서 각 기사에 대한 예측 값을 업데이트합니다.
    const updatePromises = updates.map(update =>
      //@ts-ignore
      db.mezoome_articles.update(update)
    );

    // 모든 업데이트 작업을 병렬로 수행합니다.
    await Promise.all(updatePromises);
    console.log(`Updated ${updates.length} predictions`);
  }
};