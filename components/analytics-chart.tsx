"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Icon } from "@iconify/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { cn } from "@/lib/utils";

type ChartData = {
  month: string;
  value: number;
  lastYearValue: number;
};

type Chart = {
  key: string;
  title: string;
  value: number;
  suffix: string;
  type: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  chartData: ChartData[];
};

const formatValue = (value: number, type: string | undefined) => {
  if (type === "number") {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return value.toLocaleString();
  }
  if (type === "percentage") return `${value}%`;
  return value;
};

const formatMonth = (month: string) => {
  const monthNumber =
    {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    }[month] ?? 0;
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2024, monthNumber, 1));
};

interface AnalyticsChartProps {
  data: Chart[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [activeChart, setActiveChart] = React.useState<(typeof data)[number]["key"]>(data[0].key);

  const activeChartData = React.useMemo(() => {
    const chart = data.find((d) => d.key === activeChart);
    return {
      chartData: chart?.chartData ?? [],
      color:
        chart?.changeType === "positive"
          ? "success"
          : chart?.changeType === "negative"
            ? "danger"
            : "default",
      suffix: chart?.suffix,
      type: chart?.type,
    };
  }, [activeChart, data]);

  const { chartData, color, suffix, type } = activeChartData;

  return (
    <Card as="dl" className="dark:border-default-100 border border-transparent">
      <section className="flex flex-col flex-nowrap">
        <div className="flex flex-col justify-between gap-y-2 p-6">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-0">
              <dt className="text-medium text-foreground font-medium"></dt> 
            </div>
            <div className="mt-4 flex w-full items-center">
              <div className="-my-3 flex w-full max-w-[800px] items-center gap-x-3 overflow-x-auto py-3">
                {data.map(({ key, change, changeType, type, value, title }) => (
                  <button
                    key={key}
                    className={cn(
                      "rounded-medium flex w-full flex-col gap-2 p-3 transition-colors",
                      {
                        "bg-default-100": activeChart === key,
                      }
                    )}
                    onClick={() => setActiveChart(key)}
                  >
                    <span
                      className={cn("text-small text-default-500 font-medium transition-colors", {
                        "text-primary": activeChart === key,
                      })}
                    >
                      {title}
                    </span>
                    <div className="flex items-center gap-x-3">
                      <span className="text-foreground text-3xl font-bold">
                        {formatValue(value, type)}
                      </span>
                      <Chip
                        classNames={{
                          content: "font-medium",
                        }}
                        color={
                          changeType === "positive"
                            ? "success"
                            : changeType === "negative"
                              ? "danger"
                              : "default"
                        }
                        radius="sm"
                        size="sm"
                        startContent={
                          changeType === "positive" ? (
                            <Icon height={16} icon={"solar:arrow-right-up-linear"} width={16} />
                          ) : changeType === "negative" ? (
                            <Icon height={16} icon={"solar:arrow-right-down-linear"} width={16} />
                          ) : (
                            <Icon height={16} icon={"solar:arrow-right-linear"} width={16} />
                          )
                        }
                        variant="flat"
                      >
                        <span>{change}</span>
                      </Chip>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ResponsiveContainer
          className="min-h-[300px] [&_.recharts-surface]:outline-hidden"
          height="100%"
          width="100%"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            height={300}
            margin={{
              left: 0,
              right: 0,
            }}
            width={500}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="10%"
                  stopColor={`hsl(var(--heroui-${color}-500))`}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={`hsl(var(--heroui-${color}-100))`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontalCoordinatesGenerator={() => [200, 150, 100, 50]}
              stroke="hsl(var(--heroui-default-200))"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="month"
              style={{ fontSize: "var(--heroui-font-size-tiny)", transform: "translateX(-40px)" }}
              tickLine={false}
            />
            <Tooltip
              content={({ label, payload }) => (
                <div className="rounded-medium bg-foreground text-tiny shadow-small flex h-auto min-w-[120px] items-center gap-x-2 p-2">
                  <div className="flex w-full flex-col gap-y-0">
                    {payload?.map((p, index) => {
                      const name = p.name;
                      const value = p.value;
                      return (
                        <div key={`${index}-${name}`} className="flex w-full items-center gap-x-2">
                          <div className="text-small text-background flex w-full items-center gap-x-1">
                            <span>{formatValue(value as number, type)}</span>
                            <span>{suffix}</span>
                          </div>
                        </div>
                      );
                    })}
                    <span className="text-small text-foreground-400 font-medium">
                      {formatMonth(label)} 25, 2024
                    </span>
                  </div>
                </div>
              )}
              cursor={{
                strokeWidth: 0,
              }}
            />
            <Area
              activeDot={{
                stroke: `hsl(var(--heroui-${color === "default" ? "foreground" : color}))`,
                strokeWidth: 2,
                fill: "hsl(var(--heroui-background))",
                r: 5,
              }}
              animationDuration={1000}
              animationEasing="ease"
              dataKey="value"
              fill="url(#colorGradient)"
              stroke={`hsl(var(--heroui-${color === "default" ? "foreground" : color}))`}
              strokeWidth={2}
              type="monotone"
            />
            <Area
              activeDot={{
                stroke: "hsl(var(--heroui-default-400))",
                strokeWidth: 2,
                fill: "hsl(var(--heroui-background))",
                r: 5,
              }}
              animationDuration={1000}
              animationEasing="ease"
              dataKey="lastYearValue"
              fill="transparent"
              stroke="hsl(var(--heroui-default-400))"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
        <Dropdown
          classNames={{
            content: "min-w-[120px]",
          }}
          placement="bottom-end"
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              className="absolute top-2 right-2 w-auto rounded-full"
              size="sm"
              variant="light"
            >
              <Icon height={16} icon="solar:menu-dots-bold" width={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            itemClasses={{
              title: "text-tiny",
            }}
            variant="flat"
          >
            <DropdownItem key="view-details">View Details</DropdownItem>
            <DropdownItem key="export-data">Export Data</DropdownItem>
            <DropdownItem key="set-alert">Set Alert</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </section>
    </Card>
  );
}

