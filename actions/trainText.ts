"use server";
import db from "@/lib/prismadb";
import { ResultEnum } from "@/type/ResultEnum";

export const trainText = async (text: string, type: ResultEnum) => {

  let score = 0.5;
  if (type === ResultEnum.EXTREME_FEAR) {
    score = 0.1;
  }
  if (type === ResultEnum.FEAR) {
    score = 0.3;
  }
  if (type === ResultEnum.NEUTRAL) {
    score = 0.5;
  }
  if (type === ResultEnum.GREED) {
    score = 0.7;
  }
  if (type === ResultEnum.EXTREME_GREED) {
    score = 0.9;
  }
  console.log(score);
  const result = await fetch(`${process.env.MEZOOME_URL}/train`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text, label: score })
  });
  console.log(await result.json());
  if (result.status === 200) {
    const rep = await fetch(`${process.env.MEZOOME_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, label: score })
    });
    const data = await rep.json();

    // 0~25 : EXTREME_FEAR
    // 25~50 : FEAR
    // 45~55 : NEUTRAL
    // 55~75 : GREED
    // 75~100 : EXTREME_GREED
    const result_number = Math.floor(data.prediction * 100);
    let result: ResultEnum;
    if (data.prediction * 100 < 25) {
      result = ResultEnum.EXTREME_FEAR;
    } else if (data.prediction * 100 < 45) {
      result = ResultEnum.FEAR;
    } else if (data.prediction * 100 < 55) {
      result = ResultEnum.NEUTRAL;
    } else if (data.prediction * 100 < 75) {
      result = ResultEnum.GREED;
    } else {
      result = ResultEnum.EXTREME_GREED;
    }

    const output = await db.learning.create({
      data: {
        text,
        score: score,
        prediction: data.prediction,
        result: result,
        result_number: result_number,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return { data: output, result: true };
  }
  return { data: null, result: false };
};