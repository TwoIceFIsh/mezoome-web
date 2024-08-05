import { LearningForm } from "@/components/LearningForm";
import FearGreedIndex from "@/components/FearAndGreedIndex";
import React from "react";
import Header from "@/components/Header";
import LearningBar from "@/components/LearningBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TrendBar from "@/components/TrendBar";
import { MezoomeChart } from "@/components/MezoomeChart";
import { getChartData } from "@/actions/getChartData";
import Link from "next/link";
import db from "@/lib/prismadb";
import { getMezoomeIndex } from "@/actions/getMezoomeIndex";
import getFearAndGreedIndex from "@/actions/getFearAndGreedIndex";

export const revalidate = 0;
const getLast7Days = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
  }
  return `${dates[dates.length - 1]} ~ ${dates[0]}`;
};
export default async function Home() {
  const articles = await db.mezoome_articles.findMany({
    take: 25,
    orderBy: {
      articleId: "desc"
    }
  });

  const fearAndGreedIndex = await getFearAndGreedIndex();
  const mezoomeIndex = await getMezoomeIndex();
  const chartData = await getChartData();
  const oneWeekAgoTimestamp = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;

  const trendArticles = await db.mezoome_articles.findMany({
    take: 20,
    orderBy: {
      readCount: "desc"
    },
    where: {
      writeDateTimestamp: {
        gt: oneWeekAgoTimestamp
      }
    }
  });
  const articles_count = await db.mezoome_articles.count();
  return (
    <div className={"h-full items-center justify-start flex flex-col space-y-8 w-full"}>
      <Header className={"justify-start w-full"} />
      <Card className={"xl:w-3/5 w-full"}>
        <CardHeader className={"  pb-6"}>
          <CardTitle className={"flex flex-col justify-center w-full text-center"}>
            <div className={"text-3xl font-bold flex justify-center  items-center gap-2"}>미주미 지수(Mezoome
              Index)
            </div>
            <div className={"text-sm font-normal"}>
              미주미 지수는 인간지표를 추종하고 있습니다.
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className={" w-full justify-center gap-6 grid md:grid-cols-2"}>
          <FearGreedIndex title={" CNN 공포 탐욕 지수"} data={fearAndGreedIndex} />
          <FearGreedIndex title={"미주미 지수"} data={mezoomeIndex} />
        </CardContent>
      </Card>
      <div className={"xl:w-3/5 w-full"}>
        <MezoomeChart chartData={chartData} />
      </div>


      <Card className={"xl:w-3/5 w-full "}>
        <CardHeader>
          <CardTitle>
            미주미 트랜드
          </CardTitle>
          <CardDescription className={""}>
            {getLast7Days()}
          </CardDescription>
        </CardHeader>
        <CardContent className={"space-y-4"}>
          <TrendBar data={trendArticles} />
        </CardContent>
      </Card>
      <Card className={"xl:w-3/5 w-full "}>
        <CardHeader>
          <CardTitle>AI 평가 현황</CardTitle>
          <CardDescription className={""}>
            총 {articles_count} 건의 학습 데이터가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className={"space-y-4"}>
          <LearningBar data={articles} />
          <LearningForm />
        </CardContent>
      </Card>
      <div className={"text-center underline"}>
        <Link href={"https://www.cyber-luna.com/"}>
          제작자 미주미 - 퍼그가 미래다 v20240805</Link>
      </div>
    </div>

  );
}