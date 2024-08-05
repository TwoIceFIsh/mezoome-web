"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const chartConfig = {
  visitors: {
    label: "Visitors"
  },
  fgi: {
    label: "공포탐욕지수",
    color: "hsl(var(--chart-1))"
  },
  mezoome: {
    label: "미주미지수",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;


export function MezoomeChart({ chartData }: any) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const filteredData = chartData.filter((item: any) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;

    if (timeRange === "365d") {
      daysToSubtract = 365;
    }
    if (timeRange === "180d") {
      daysToSubtract = 180;
    }


    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 flex-row">
        <div className="grid flex-1 gap-1 sm:text-left">
          <CardTitle>공포탐욕 vs 미주미</CardTitle>
          <CardDescription>
            업데이트 주기 1시간
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="365d" className="rounded-lg">
              지난 1년
            </SelectItem>
            <SelectItem value="180d" className="rounded-lg">
              지난 6개월
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              지난 3개월
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              지난 30일
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              지난 7일
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillMezoome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mezoome)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mezoome)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFgi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-fgi)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-fgi)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric"
                });
              }}
            />
            <YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric"
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="fgi"
              type="natural"
              fill="url(#fillFgi)"
              stroke="var(--color-fgi)"

            />
            <Area
              dataKey="mezoome"
              type="natural"
              fill="url(#fillMezoome)"
              stroke="var(--color-mezoome)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}