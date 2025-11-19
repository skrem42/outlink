"use client";

import type { CardProps } from "@heroui/card";
import type { IconifyIcon } from "@iconify/react";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import React from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { Icon } from "@iconify/react";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const chart = tv({
  slots: {
    card: "shadow-none",
    iconWrapper: "rounded-small p-2",
    trendIconWrapper: "mt-2 flex items-center gap-x-1 text-xs font-medium",
  },
  variants: {
    color: {
      default: {
        card: "bg-default-50",
        iconWrapper: "bg-default-200/50 text-default-700",
        trendIconWrapper: "text-default-700",
      },
      primary: {
        card: "bg-primary-50 ",
        iconWrapper: "bg-primary-100 dark:bg-primary-100/50 text-primary",
        trendIconWrapper: "text-primary",
      },
      secondary: {
        card: "bg-secondary-50",
        iconWrapper: "bg-secondary-100 dark:bg-secondary-100/50 text-secondary",
        trendIconWrapper: "text-secondary",
      },
      success: {
        card: "bg-success-50",
        iconWrapper: "bg-success-100 dark:bg-success-100/50 text-success",
        trendIconWrapper: "text-success",
      },
      warning: {
        card: "bg-warning-50",
        iconWrapper: "bg-warning-100 dark:bg-warning-100/50 text-warning",
        trendIconWrapper: "text-warning",
      },
      danger: {
        card: "bg-danger-50",
        iconWrapper: "bg-danger-100 dark:bg-danger-100/50 text-danger",
        trendIconWrapper: "text-danger",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type ChartData = {
  month: string;
  value: number;
};

type ChartCardProps = {
  title: string;
  value: number | string;
  change: string;
  index: number;
  xaxis: "month" | "day";
  chartData: ChartData[];
  icon?: IconifyIcon | string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
} & Omit<CardProps, "children" | "classNames">;

const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, value, change, color, icon, xaxis, chartData, index, className, ...props }, ref) => {
    const classes = React.useMemo(() => chart({ color }), [color]);

    return (
      <Card
        ref={ref}
        className={classes.card({
          className,
        })}
        {...props}
      >
        <section className="flex flex-nowrap justify-between">
          <div className="flex flex-col justify-between gap-y-2 p-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-3">
                {icon && (
                  <div className={classes.iconWrapper()}>
                    <Icon className="text-inherit" height={16} icon={icon} width={16} />
                  </div>
                )}
                <dt className="text-default-600 text-sm font-medium">{title}</dt>
              </div>
              <dd className="text-default-700 text-3xl font-semibold">{value}</dd>
            </div>
            <div className={classes.trendIconWrapper()}>
              {color === "success" ? (
                <Icon height={16} icon={"solar:arrow-right-up-linear"} width={16} />
              ) : color === "warning" ? (
                <Icon height={16} icon={"solar:arrow-right-linear"} width={16} />
              ) : (
                <Icon height={16} icon={"solar:arrow-right-down-linear"} width={16} />
              )}
              <span>{change}</span>
              <span className="text-default-500">
                {" "}
                vs {xaxis === "day" ? "yesterday" : "last " + xaxis}
              </span>
            </div>
          </div>
          <div className="mt-10 min-h-24 w-36 min-w-[140px] shrink-0">
            <ResponsiveContainer className="[&_.recharts-surface]:outline-hidden" width="100%">
              <AreaChart accessibilityLayer data={chartData}>
                <defs>
                  <linearGradient id={"colorUv" + index} x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={cn({
                        "hsl(var(--heroui-foreground))": color === "default",
                        "hsl(var(--heroui-success))": color === "success",
                        "hsl(var(--heroui-danger))": color === "danger",
                        "hsl(var(--heroui-warning))": color === "warning",
                        "hsl(var(--heroui-secondary))": color === "secondary",
                        "hsl(var(--heroui-primary))": color === "primary",
                      })}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="10%"
                      stopColor={cn({
                        "hsl(var(--heroui-foreground))": color === "default",
                        "hsl(var(--heroui-success))": color === "success",
                        "hsl(var(--heroui-danger))": color === "danger",
                        "hsl(var(--heroui-warning))": color === "warning",
                        "hsl(var(--heroui-secondary))": color === "secondary",
                        "hsl(var(--heroui-primary))": color === "primary",
                      })}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <YAxis domain={[Math.min(...chartData.map((d) => d.value)), "auto"]} hide={true} />
                <Area
                  dataKey="value"
                  fill={`url(#colorUv${index})`}
                  stroke={cn({
                    "hsl(var(--heroui-foreground))": color === "default",
                    "hsl(var(--heroui-success))": color === "success",
                    "hsl(var(--heroui-danger))": color === "danger",
                    "hsl(var(--heroui-warning))": color === "warning",
                    "hsl(var(--heroui-secondary))": color === "secondary",
                    "hsl(var(--heroui-primary))": color === "primary",
                  })}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
);

ChartCard.displayName = "ChartCard";

export { ChartCard };
export type { ChartCardProps, ChartData };

