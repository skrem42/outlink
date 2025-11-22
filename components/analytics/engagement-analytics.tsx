"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EngagementAnalyticsProps {
  avgSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  totalSessions: number;
}

export function EngagementAnalytics({
  avgSessionDuration,
  pagesPerSession,
  bounceRate,
  totalSessions,
}: EngagementAnalyticsProps) {
  // Mock session duration distribution data
  const durationDistribution = [
    { range: "0-10s", count: Math.floor(totalSessions * 0.15) },
    { range: "10-30s", count: Math.floor(totalSessions * 0.25) },
    { range: "30s-1m", count: Math.floor(totalSessions * 0.20) },
    { range: "1-3m", count: Math.floor(totalSessions * 0.18) },
    { range: "3-5m", count: Math.floor(totalSessions * 0.12) },
    { range: "5-10m", count: Math.floor(totalSessions * 0.07) },
    { range: "10m+", count: Math.floor(totalSessions * 0.03) },
  ];

  // Mock interaction depth (scroll depth, time on page, etc)
  const interactionDepth = [
    { depth: "0-25%", count: Math.floor(totalSessions * 0.20) },
    { depth: "25-50%", count: Math.floor(totalSessions * 0.25) },
    { depth: "50-75%", count: Math.floor(totalSessions * 0.30) },
    { depth: "75-100%", count: Math.floor(totalSessions * 0.25) },
  ];

  // Mock click-through rate trend
  const ctrTrend = [
    { date: "Mon", ctr: 42.5, sessions: 120 },
    { date: "Tue", ctr: 45.2, sessions: 140 },
    { date: "Wed", ctr: 38.9, sessions: 98 },
    { date: "Thu", ctr: 51.3, sessions: 156 },
    { date: "Fri", ctr: 48.7, sessions: 180 },
    { date: "Sat", ctr: 44.1, sessions: 145 },
    { date: "Sun", ctr: 40.2, sessions: 132 },
  ];

  // Mock device engagement
  const deviceEngagement = [
    { device: "Mobile", avgTime: avgSessionDuration * 0.85, sessions: Math.floor(totalSessions * 0.65) },
    { device: "Desktop", avgTime: avgSessionDuration * 1.25, sessions: Math.floor(totalSessions * 0.30) },
    { device: "Tablet", avgTime: avgSessionDuration * 1.05, sessions: Math.floor(totalSessions * 0.05) },
  ];

  // Calculate engagement score (0-100)
  const engagementScore = Math.min(100, Math.round(
    (pagesPerSession * 10) + 
    ((avgSessionDuration / 300) * 30) + 
    ((100 - bounceRate) * 0.5)
  ));

  const getScoreColor = (score: number) => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Engagement Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:medal-star-linear" className="text-primary" width={24} />
              <p className="text-small text-default-500">Engagement Score</p>
            </div>
            <p className={`text-4xl font-bold text-${getScoreColor(engagementScore)}`}>
              {engagementScore}
            </p>
            <p className="text-tiny text-default-500 mt-1">out of 100</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:clock-circle-linear" className="text-warning" width={24} />
              <p className="text-small text-default-500">Avg. Session</p>
            </div>
            <p className="text-4xl font-bold">{formatDuration(avgSessionDuration)}</p>
            <p className="text-tiny text-default-500 mt-1">per visitor</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:cursor-square-linear" className="text-success" width={24} />
              <p className="text-small text-default-500">Click-Through Rate</p>
            </div>
            <p className="text-4xl font-bold">{(bounceRate < 100 ? 100 - bounceRate : 45).toFixed(1)}%</p>
            <p className="text-tiny text-default-500 mt-1">visitors who clicked CTA</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:close-circle-linear" className="text-danger" width={24} />
              <p className="text-small text-default-500">Bounce Rate</p>
            </div>
            <p className="text-4xl font-bold">{bounceRate.toFixed(1)}%</p>
            <p className="text-tiny text-default-500 mt-1">bounced sessions</p>
          </CardBody>
        </Card>
      </div>

      {/* Session Duration Distribution */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Session Duration Distribution</h3>
          <p className="text-small text-default-500">Time spent on site</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationDistribution}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="range" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Interaction Depth */}
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Page Interaction Depth</h3>
            <p className="text-small text-default-500">How far visitors scroll</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interactionDepth}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="depth" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Click-Through Rate Trend */}
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Click-Through Rate Trend</h3>
            <p className="text-small text-default-500">Daily CTA performance</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ctrTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ctr"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="CTR %"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Average Time by Device */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Engagement by Device</h3>
          <p className="text-small text-default-500">Average session time per device</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {deviceEngagement.map((device, index) => (
              <div key={device.device} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        device.device === "Mobile"
                          ? "solar:smartphone-linear"
                          : device.device === "Tablet"
                          ? "solar:tablet-linear"
                          : "solar:monitor-linear"
                      }
                      width={20}
                    />
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-small text-default-500">
                      {formatDuration(Math.round(device.avgTime))}
                    </span>
                    <span className="text-small font-semibold">{device.sessions} sessions</span>
                  </div>
                </div>
                <div className="relative w-full bg-default-200 rounded-full h-2">
                  <div
                    className="absolute h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(device.sessions / totalSessions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

