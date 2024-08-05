"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { EyeIcon, HeartIcon, MessageCircle } from "lucide-react";
import Link from "next/link";


//id: string, text: string, score: number, prediction: number, result: $Enums.ResultType, result_number: number, createdAt: Date, updatedAt: Date

interface LearningBarProps {
  data: any[];
}


const TrendBar = ({ data }: LearningBarProps) => {
  return (
    <div className={"flex items-center gap-2 rounded-2xl border p-4"}>
      <div className={"flex w-[50px] gap-2"}>
        <MessageCircle />
        <div className={"font-bold"}> |</div>
      </div>

      <Carousel
        orientation={"vertical"}
        plugins={[
          Autoplay({
            delay: 2000
          })
        ]}
      >


        <CarouselContent className={"h-16 w-full"}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <CarouselItem key={index}>
                <Link href={`https://cafe.naver.com/likeusstock/${item.articleId}`} target={"_blank"}>

                  {index + 1}위
                  [{item.menuName}] {item.subject.length > 20 ? item.subject.slice(0, 20) + "..." : item.subject}
                  <div className={"flex gap-2 items-center"}>
                    {item.memberLevel === 110 && "lv.1"}
                    {item.memberLevel === 120 && "lv.2"}
                    {item.memberLevel === 130 && "lv.3"} {item.writerNickname}
                    <div className={"flex gap-2 items-center"}>
                      <div className={"flex gap-2 items-center"}>
                        <HeartIcon className={"w-4 h-4"} />
                        {item.likeItCount}
                      </div>
                      <div className={"flex gap-2 items-center"}>
                        <MessageCircle className={"w-4 h-4"} />{item.commentCount}
                      </div>
                      <div className={"flex gap-2 items-center"}>
                        <EyeIcon className={"w-4 h-4"} />{item.readCount}
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>Not Found</CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TrendBar;