import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/prismadb";
import moment from "moment";

export async function GET(request: NextRequest, { params }: { params: { page: number } }) {
  // 게시글 데이터 가져오기
  const articles = await db.mezoome_articles.findMany({
    select: {
      writeDateTimestamp: true,
      subject: true
    },
    orderBy: {
      writeDateTimestamp: "desc"
    },

    take: 50,
    skip: (params.page - 1) * 50
  });

  // 공포지수 데이터 가져오기
  const fgi = await db.fear_and_greed_index.findMany();

  // 날짜별 공포지수 맵 생성
  const fearGreedMap = new Map();
  fgi.forEach((data) => {
    const date = moment(Number(data.date)).format("YYYY-MM-DD");
    fearGreedMap.set(date, data.index);
  });

  // 공포지수 맵의 날짜를 정렬하여 가장 최신 데이터 찾기
  const sortedDates = Array.from(fearGreedMap.keys()).sort((a, b) => moment(b).diff(moment(a)));

  // 공포지수 없는 날짜에 대해 가장 최근의 공포지수로 대체
  const getLatestFearGreedIndex = (date: any) => {
    // 날짜가 공포지수 맵에 있는지 확인
    if (fearGreedMap.has(date)) {
      return fearGreedMap.get(date);
    }

    // 공포지수 데이터가 없는 경우 가장 최근의 공포지수 찾기
    for (const sortedDate of sortedDates) {
      if (moment(sortedDate).isBefore(moment(date))) {
        return fearGreedMap.get(sortedDate);
      }
    }
    // 가장 최근의 공포지수도 없는 경우 기본값 설정
    return null;
  };

  // 게시글 데이터에 공포지수 추가
  const mergedData = articles.map((article) => {
    const date = moment(Number(article.writeDateTimestamp)).format("YYYY-MM-DD");
    const fearGreedIndex = getLatestFearGreedIndex(date);

    return {
      date: date,
      title: article.subject,
      fear_greed_index: fearGreedIndex
    };
  });

  return NextResponse.json({ result: mergedData });
}