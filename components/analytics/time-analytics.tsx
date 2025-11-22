"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
import type { HourlyPattern } from "@/types/database";

interface TimeAnalyticsProps {
  hourlyPatterns: HourlyPattern[];
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimeAnalytics({ hourlyPatterns }: TimeAnalyticsProps) {
  // Aggregate by hour (across all days)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const patterns = hourlyPatterns.filter(p => p.hour === hour);
    return {
      hour: `${hour}:00`,
      clicks: patterns.reduce((sum, p) => sum + p.clicks, 0),
      conversions: patterns.reduce((sum, p) => sum + p.conversions, 0),
    };
  });

  // Aggregate by day of week
  const dailyData = DAYS_OF_WEEK.map((day, dayIndex) => {
    const patterns = hourlyPatterns.filter(p => p.day_of_week === dayIndex);
    return {
      day,
      clicks: patterns.reduce((sum, p) => sum + p.clicks, 0),
      conversions: patterns.reduce((sum, p) => sum + p.conversions, 0),
    };
  });

  // Create heatmap data (24 hours x 7 days)
  const heatmapData = DAYS_OF_WEEK.map((day, dayIndex) => {
    const dayData: any = { day };
    for (let hour = 0; hour < 24; hour++) {
      const pattern = hourlyPatterns.find(p => p.day_of_week === dayIndex && p.hour === hour);
      dayData[`h${hour}`] = pattern ? pattern.clicks : 0;
    }
    return dayData;
  });

  // Find peak hours
  const peakHour = hourlyData.reduce((max, curr) => curr.clicks > max.clicks ? curr : max, hourlyData[0]);
  const peakDay = dailyData.reduce((max, curr) => curr.clicks > max.clicks ? curr : max, dailyData[0]);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Peak Times Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-small text-default-500">Peak Hour</p>
              <p className="text-2xl font-bold">{peakHour.hour}</p>
              <p className="text-small text-default-500">{peakHour.clicks} clicks</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-small text-default-500">Peak Day</p>
              <p className="text-2xl font-bold">{peakDay.day}</p>
              <p className="text-small text-default-500">{peakDay.clicks} clicks</p>
            </div>
            <div className="p-3 bg-success/10 rounded-full">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Hourly Traffic Pattern */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Traffic by Hour</h3>
          <p className="text-small text-default-500">24-hour activity pattern</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="hour" stroke="#888" fontSize={12} />
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
                dataKey="clicks"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Day of Week Pattern */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Traffic by Day of Week</h3>
          <p className="text-small text-default-500">Weekly activity comparison</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="clicks" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              <Bar dataKey="conversions" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Activity Heatmap</h3>
          <p className="text-small text-default-500">Hour × Day traffic intensity</p>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-small text-left">Day</th>
                  {Array.from({ length: 24 }, (_, i) => (
                    <th key={i} className="p-2 text-tiny text-center">{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((dayData, index) => {
                  const maxValue = Math.max(...Object.values(dayData).filter(v => typeof v === 'number') as number[]);
                  return (
                    <tr key={dayData.day}>
                      <td className="p-2 text-small font-medium">{dayData.day.substring(0, 3)}</td>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const value = dayData[`h${hour}`] || 0;
                        const intensity = maxValue > 0 ? value / maxValue : 0;
                        const bgColor = `rgba(14, 165, 233, ${intensity})`;
                        return (
                          <td
                            key={hour}
                            className="p-1 text-center"
                            style={{ backgroundColor: bgColor }}
                            title={`${dayData.day} ${hour}:00 - ${value} clicks`}
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-tiny">
                              {value > 0 ? value : ''}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

