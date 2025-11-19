"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ChartCard } from "@/components/chart-card";

// Sample data for dashboard overview
const kpiData = [
  {
    title: "Total Clicks",
    value: "24.5K",
    change: "+12.5%",
    color: "primary" as const,
    icon: "solar:cursor-linear",
    xaxis: "month" as const,
    chartData: [
      { month: "January", value: 18200 },
      { month: "February", value: 22100 },
      { month: "March", value: 19800 },
      { month: "April", value: 23500 },
      { month: "May", value: 25800 },
      { month: "June", value: 24500 },
    ],
  },
  {
    title: "Active Links",
    value: "32",
    change: "+8.3%",
    color: "success" as const,
    icon: "solar:link-circle-linear",
    xaxis: "month" as const,
    chartData: [
      { month: "January", value: 25 },
      { month: "February", value: 27 },
      { month: "March", value: 28 },
      { month: "April", value: 30 },
      { month: "May", value: 31 },
      { month: "June", value: 32 },
    ],
  },
  {
    title: "Total Creators",
    value: "15",
    change: "+20%",
    color: "warning" as const,
    icon: "solar:users-group-rounded-linear",
    xaxis: "month" as const,
    chartData: [
      { month: "January", value: 10 },
      { month: "February", value: 11 },
      { month: "March", value: 12 },
      { month: "April", value: 13 },
      { month: "May", value: 14 },
      { month: "June", value: 15 },
    ],
  },
  {
    title: "Active Domains",
    value: "5",
    change: "0%",
    color: "secondary" as const,
    icon: "solar:global-linear",
    xaxis: "month" as const,
    chartData: [
      { month: "January", value: 5 },
      { month: "February", value: 5 },
      { month: "March", value: 5 },
      { month: "April", value: 5 },
      { month: "May", value: 5 },
      { month: "June", value: 5 },
    ],
  },
];

const recentActivity = [
  {
    id: 1,
    action: "New link added",
    details: "Instagram Profile",
    time: "2 minutes ago",
    icon: "solar:link-circle-bold-duotone",
    color: "primary",
  },
  {
    id: 2,
    action: "Domain verified",
    details: "mybrand.com",
    time: "1 hour ago",
    icon: "solar:check-circle-bold-duotone",
    color: "success",
  },
  {
    id: 3,
    action: "New creator joined",
    details: "Sarah Johnson",
    time: "3 hours ago",
    icon: "solar:user-plus-bold-duotone",
    color: "secondary",
  },
  {
    id: 4,
    action: "Analytics milestone",
    details: "10K total clicks reached",
    time: "5 hours ago",
    icon: "solar:chart-bold-duotone",
    color: "warning",
  },
];

const quickActions = [
  {
    title: "Add New Link",
    description: "Create a new link for your bio",
    icon: "solar:add-circle-bold-duotone",
    color: "primary",
    href: "/dashboard/links",
  },
  {
    title: "View Analytics",
    description: "Check your performance metrics",
    icon: "solar:chart-bold-duotone",
    color: "success",
    href: "/dashboard/analytics",
  },
  {
    title: "Manage Domains",
    description: "Add or configure your domains",
    icon: "solar:global-bold-duotone",
    color: "warning",
    href: "/dashboard/domains",
  },
  {
    title: "Invite Creator",
    description: "Add a new creator to your network",
    icon: "solar:user-plus-bold-duotone",
    color: "secondary",
    href: "/dashboard/creators",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-default-500 mt-1">
            Welcome back! Here's what's happening with your links
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        {kpiData.map((stat, index) => (
          <ChartCard key={index} {...stat} index={index} />
        ))}
      </dl>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const colorClasses = {
              primary: { bg: "bg-primary/10", text: "text-primary" },
              success: { bg: "bg-success/10", text: "text-success" },
              warning: { bg: "bg-warning/10", text: "text-warning" },
              secondary: { bg: "bg-secondary/10", text: "text-secondary" },
            }[action.color] || { bg: "bg-default/10", text: "text-default" };

            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:scale-[1.02] transition-transform cursor-pointer">
                  <CardBody className="gap-3 p-5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses.bg}`}
                    >
                      <Icon
                        icon={action.icon}
                        className={colorClasses.text}
                        width={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-small text-default-500">
                        {action.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </CardHeader>
          <CardBody className="gap-4">
            {recentActivity.map((activity) => {
              const colorClasses = {
                primary: { bg: "bg-primary/10", text: "text-primary" },
                success: { bg: "bg-success/10", text: "text-success" },
                warning: { bg: "bg-warning/10", text: "text-warning" },
                secondary: { bg: "bg-secondary/10", text: "text-secondary" },
              }[activity.color] || { bg: "bg-default/10", text: "text-default" };

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-default-100 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colorClasses.bg}`}
                  >
                    <Icon
                      icon={activity.icon}
                      className={colorClasses.text}
                      width={20}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-small">{activity.action}</p>
                    <p className="text-small text-default-500">
                      {activity.details}
                    </p>
                  </div>
                  <span className="text-tiny text-default-400 flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </CardBody>
        </Card>

        {/* Upgrade Card */}
        <Card className="bg-gradient-to-br from-primary to-secondary text-white">
          <CardBody className="gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Icon icon="solar:crown-bold" className="text-white" width={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Upgrade to Pro</h3>
              <p className="text-small text-white/80 mt-1">
                Unlock unlimited links, custom domains, advanced analytics, and
                priority support
              </p>
            </div>
            <ul className="space-y-2 text-small">
              <li className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" width={16} />
                <span>Unlimited links</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" width={16} />
                <span>Custom domains</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" width={16} />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="solar:check-circle-bold" width={16} />
                <span>Priority support</span>
              </li>
            </ul>
            <Button
              className="bg-white text-primary font-semibold"
              fullWidth
              endContent={<Icon icon="solar:arrow-right-linear" width={16} />}
            >
              Upgrade Now
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

