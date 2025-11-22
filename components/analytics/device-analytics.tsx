"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DeviceBreakdown, BrowserBreakdown, OSBreakdown, ScreenResolutionData } from "@/types/database";

interface DeviceAnalyticsProps {
  devices: DeviceBreakdown[];
  browsers: BrowserBreakdown[];
  os: OSBreakdown[];
  resolutions: ScreenResolutionData[];
}

const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType.toLowerCase()) {
    case "mobile":
      return "solar:smartphone-linear";
    case "tablet":
      return "solar:tablet-linear";
    case "desktop":
      return "solar:monitor-linear";
    default:
      return "solar:devices-linear";
  }
};

const getBrowserIcon = (browser: string) => {
  const browserLower = browser.toLowerCase();
  if (browserLower.includes("chrome")) return "logos:chrome";
  if (browserLower.includes("safari")) return "logos:safari";
  if (browserLower.includes("firefox")) return "logos:firefox";
  if (browserLower.includes("edge")) return "logos:microsoft-edge";
  return "solar:global-linear";
};

export function DeviceAnalytics({ devices, browsers, os, resolutions }: DeviceAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Device Type Breakdown */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Device Types</h3>
          <p className="text-small text-default-500">Traffic by device category</p>
        </CardHeader>
        <CardBody className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={devices}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device_type, percentage }) => `${device_type}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Device Stats Cards */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Device Statistics</h3>
          <p className="text-small text-default-500">Detailed breakdown</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {devices.map((device, index) => (
              <div key={device.device_type} className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${index === 0 ? 'bg-primary' : 'bg-default-200'}`}>
                    <Icon
                      icon={getDeviceIcon(device.device_type)}
                      className={index === 0 ? 'text-white' : 'text-default-600'}
                      width={24}
                    />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{device.device_type}</p>
                    <p className="text-small text-default-500">{device.count} visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{device.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Browser Breakdown */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Browser Distribution</h3>
          <p className="text-small text-default-500">Most used browsers</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={browsers}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="browser" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {browsers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Operating System */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Operating Systems</h3>
          <p className="text-small text-default-500">OS distribution</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {os.map((osItem, index) => (
              <div key={osItem.os} className="space-y-1">
                <div className="flex justify-between text-small">
                  <span className="font-medium">{osItem.os}</span>
                  <div className="flex gap-2">
                    <span className="text-default-500">{osItem.count} users</span>
                    <span className="font-semibold">{osItem.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full bg-default-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${osItem.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Screen Resolutions */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Screen Resolutions</h3>
          <p className="text-small text-default-500">Most common screen sizes</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutions.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="resolution" stroke="#888" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}

