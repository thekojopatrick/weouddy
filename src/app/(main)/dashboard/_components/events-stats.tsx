'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { date: '2024-04-01', hosted: 222, joined: 150 },
  { date: '2024-04-02', hosted: 97, joined: 180 },
  { date: '2024-04-03', hosted: 167, joined: 120 },
  { date: '2024-04-04', hosted: 242, joined: 260 },
  { date: '2024-04-05', hosted: 373, joined: 290 },
  { date: '2024-04-06', hosted: 301, joined: 340 },
  { date: '2024-04-07', hosted: 245, joined: 180 },
  { date: '2024-04-08', hosted: 409, joined: 320 },
  { date: '2024-04-09', hosted: 59, joined: 110 },
  { date: '2024-04-10', hosted: 261, joined: 190 },
  { date: '2024-04-11', hosted: 327, joined: 350 },
  { date: '2024-04-12', hosted: 292, joined: 210 },
  { date: '2024-04-13', hosted: 342, joined: 380 },
  { date: '2024-04-14', hosted: 137, joined: 220 },
  { date: '2024-04-15', hosted: 120, joined: 170 },
  { date: '2024-04-16', hosted: 138, joined: 190 },
  { date: '2024-04-17', hosted: 446, joined: 360 },
  { date: '2024-04-18', hosted: 364, joined: 410 },
  { date: '2024-04-19', hosted: 243, joined: 180 },
  { date: '2024-04-20', hosted: 89, joined: 150 },
  { date: '2024-04-21', hosted: 137, joined: 200 },
  { date: '2024-04-22', hosted: 224, joined: 170 },
  { date: '2024-04-23', hosted: 138, joined: 230 },
  { date: '2024-04-24', hosted: 387, joined: 290 },
  { date: '2024-04-25', hosted: 215, joined: 250 },
  { date: '2024-04-26', hosted: 75, joined: 130 },
  { date: '2024-04-27', hosted: 383, joined: 420 },
  { date: '2024-04-28', hosted: 122, joined: 180 },
  { date: '2024-04-29', hosted: 315, joined: 240 },
  { date: '2024-04-30', hosted: 454, joined: 380 },
  { date: '2024-05-01', hosted: 165, joined: 220 },
  { date: '2024-05-02', hosted: 293, joined: 310 },
  { date: '2024-05-03', hosted: 247, joined: 190 },
  { date: '2024-05-04', hosted: 385, joined: 420 },
  { date: '2024-05-05', hosted: 481, joined: 390 },
  { date: '2024-05-06', hosted: 498, joined: 520 },
  { date: '2024-05-07', hosted: 388, joined: 300 },
  { date: '2024-05-08', hosted: 149, joined: 210 },
  { date: '2024-05-09', hosted: 227, joined: 180 },
  { date: '2024-05-10', hosted: 293, joined: 330 },
  { date: '2024-05-11', hosted: 335, joined: 270 },
  { date: '2024-05-12', hosted: 197, joined: 240 },
  { date: '2024-05-13', hosted: 197, joined: 160 },
  { date: '2024-05-14', hosted: 448, joined: 490 },
  { date: '2024-05-15', hosted: 473, joined: 380 },
  { date: '2024-05-16', hosted: 338, joined: 400 },
  { date: '2024-05-17', hosted: 499, joined: 420 },
  { date: '2024-05-18', hosted: 315, joined: 350 },
  { date: '2024-05-19', hosted: 235, joined: 180 },
  { date: '2024-05-20', hosted: 177, joined: 230 },
  { date: '2024-05-21', hosted: 82, joined: 140 },
  { date: '2024-05-22', hosted: 81, joined: 120 },
  { date: '2024-05-23', hosted: 252, joined: 290 },
  { date: '2024-05-24', hosted: 294, joined: 220 },
  { date: '2024-05-25', hosted: 201, joined: 250 },
  { date: '2024-05-26', hosted: 213, joined: 170 },
  { date: '2024-05-27', hosted: 420, joined: 460 },
  { date: '2024-05-28', hosted: 233, joined: 190 },
  { date: '2024-05-29', hosted: 78, joined: 130 },
  { date: '2024-05-30', hosted: 340, joined: 280 },
  { date: '2024-05-31', hosted: 178, joined: 230 },
  { date: '2024-06-01', hosted: 178, joined: 200 },
  { date: '2024-06-02', hosted: 470, joined: 410 },
  { date: '2024-06-03', hosted: 103, joined: 160 },
  { date: '2024-06-04', hosted: 439, joined: 380 },
  { date: '2024-06-05', hosted: 88, joined: 140 },
  { date: '2024-06-06', hosted: 294, joined: 250 },
  { date: '2024-06-07', hosted: 323, joined: 370 },
  { date: '2024-06-08', hosted: 385, joined: 320 },
  { date: '2024-06-09', hosted: 438, joined: 480 },
  { date: '2024-06-10', hosted: 155, joined: 200 },
  { date: '2024-06-11', hosted: 92, joined: 150 },
  { date: '2024-06-12', hosted: 492, joined: 420 },
  { date: '2024-06-13', hosted: 81, joined: 130 },
  { date: '2024-06-14', hosted: 426, joined: 380 },
  { date: '2024-06-15', hosted: 307, joined: 350 },
  { date: '2024-06-16', hosted: 371, joined: 310 },
  { date: '2024-06-17', hosted: 475, joined: 520 },
  { date: '2024-06-18', hosted: 107, joined: 170 },
  { date: '2024-06-19', hosted: 341, joined: 290 },
  { date: '2024-06-20', hosted: 408, joined: 450 },
  { date: '2024-06-21', hosted: 169, joined: 210 },
  { date: '2024-06-22', hosted: 317, joined: 270 },
  { date: '2024-06-23', hosted: 480, joined: 530 },
  { date: '2024-06-24', hosted: 132, joined: 180 },
  { date: '2024-06-25', hosted: 141, joined: 190 },
  { date: '2024-06-26', hosted: 434, joined: 380 },
  { date: '2024-06-27', hosted: 448, joined: 490 },
  { date: '2024-06-28', hosted: 149, joined: 200 },
  { date: '2024-06-29', hosted: 103, joined: 160 },
  { date: '2024-06-30', hosted: 446, joined: 400 },
];

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  joined: {
    label: 'Joined Events',
    color: 'hsl(var(--chart-2))',
  },
  hosted: {
    label: 'Hosted Events',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function EventsStatsComponent() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('hosted');

  const total = React.useMemo(
    () => ({
      hosted: chartData.reduce((acc, curr) => acc + curr.hosted, 0),
      joined: chartData.reduce((acc, curr) => acc + curr.joined, 0),
    }),
    []
  );

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Events Stats</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {['joined', 'hosted'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
