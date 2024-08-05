import { CircleHelp } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import React from "react";

export function QuestionCard() {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <CircleHelp
          className={"animate-pulse text-red-600 cursor-pointer"} />
      </HoverCardTrigger>
      <HoverCardContent className="w-96 text-start">
        <div className={"text-sm"}>

          <a className={"text-red-900"}>
            00-25 하락장 적극매수
          </a>
          <br />
          <a className={"text-red-600"}>25-45 하락장 매수권장
          </a>
          <br />
          <a className={"text-yellow-500"}>45-55 보합장 매수대기
          </a>
          <br />
          <a className={"text-green-600"}>
            55-75 상승장 매도권장
          </a>
          <br />
          <a className={"text-green-900"}>
            75-100 과열장 적극매도</a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}