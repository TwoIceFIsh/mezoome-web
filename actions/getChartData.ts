import db from "@/lib/prismadb";
import moment from "moment";

// 오늘 날짜를 기준으로 데이터를 필터링 및 매핑하는 함수
export const getChartData = async () => {
  // 현재 날짜와 하루 전 날짜를 가져옴
  const one_year = moment().subtract(180, "day").startOf("day").toDate();


  // 데이터 가져오기
  const fgiIndex = await db.fear_and_greed_index.findMany({
    where: {},
    orderBy: {
      date: "asc"
    }
  });
  const mzmIndex = await db.mezoome_index.findMany({
    where: {},
    orderBy: {
      date: "asc"
    }
  });

  // 날짜별로 fgi와 mezoome 데이터를 결합
  const combinedData: { [key: string]: { fgi: number; mezoome: number } } = {};

  fgiIndex.forEach(item => {
    combinedData[moment(item.date).format("YYYY-MM-DD")] = { fgi: item.index, mezoome: 0 }; // mezoome 값은 나중에 업데이트할 것
  });

  mzmIndex.forEach(item => {
    if (combinedData[moment(item.date).format("YYYY-MM-DD")]) {
      combinedData[moment(item.date).format("YYYY-MM-DD")].mezoome = item.index;
    }
  });

  // 최종 데이터 배열 생성
  return Object.keys(combinedData).map(date => ({
    date: moment(date).format("YYYY-MM-DD"),
    fgi: combinedData[date].fgi,
    mezoome: combinedData[date].mezoome
  }));
};