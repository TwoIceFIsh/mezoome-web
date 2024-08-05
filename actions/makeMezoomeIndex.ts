import db from "@/lib/prismadb";
import moment from "moment";

export const makeMezoomeIndex = async () => {
  // 모든 레코드 가져오기
  const articles = await db.mezoome_articles.findMany({
    select: {
      prediction: true,
      writeDateTimestamp: true
    },
    orderBy: {
      writeDateTimestamp: "desc"
    }
  });

  // 날짜별로 그룹화하고 평균 예측값 계산하기
  const dateMap = articles.reduce((acc, article) => {
    const date = moment(Number(article.writeDateTimestamp)).format("YYYY-MM-DD");

    if (!acc[date]) {
      acc[date] = { sum: 0, count: 0 };
    }

    acc[date].sum += article.prediction as number;
    acc[date].count += 1;

    return acc;
  }, {} as Record<string, { sum: number, count: number }>);


  // 평균값을 계산하고 배열로 변환하기
  return Promise.all(Object.entries(dateMap).map(async ([date, { sum, count }]) => {
    const averageIndex = sum / count;

    // 날짜로 기존 레코드 검색
    const existingRecord = await db.mezoome_index.findFirst({
      where: { date: new Date(date) }
    });

    if (existingRecord) {
      // 레코드가 존재하면 업데이트
      await db.mezoome_index.update({
        where: { id: existingRecord.id },
        data: { index: averageIndex }
      });
    } else {
      // 레코드가 존재하지 않으면 새로 생성
      await db.mezoome_index.create({
        data: { date: new Date(date), index: averageIndex }
      });
    }
    return { date, index: averageIndex };
  }));
};