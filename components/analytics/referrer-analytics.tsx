"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/chip";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ReferrerData, UTMData } from "@/types/database";

interface ReferrerAnalyticsProps {
  referrers: ReferrerData[];
  utmData: UTMData[];
}

const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];

const getReferrerDomain = (url: string) => {
  if (url === "direct") return "Direct";
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return url;
  }
};

const getReferrerIcon = (referrer: string) => {
  const domain = getReferrerDomain(referrer).toLowerCase();
  if (domain === "direct") return "solar:cursor-linear";
  if (domain.includes("google")) return "logos:google-icon";
  if (domain.includes("facebook")) return "logos:facebook";
  if (domain.includes("twitter") || domain.includes("x.com")) return "logos:twitter";
  if (domain.includes("instagram")) return "skill-icons:instagram";
  if (domain.includes("linkedin")) return "logos:linkedin-icon";
  if (domain.includes("tiktok")) return "logos:tiktok-icon";
  if (domain.includes("reddit")) return "logos:reddit-icon";
  return "solar:link-circle-linear";
};

export function ReferrerAnalytics({ referrers, utmData }: ReferrerAnalyticsProps) {
  const topReferrers = referrers.slice(0, 10);
  
  // Calculate direct vs referred traffic
  const directTraffic = referrers.find(r => r.is_direct);
  const referredTraffic = referrers.filter(r => !r.is_direct);
  const totalClicks = referrers.reduce((sum, r) => sum + r.clicks, 0);
  
  const trafficSources = [
    {
      name: "Direct",
      value: directTraffic?.clicks || 0,
      percentage: totalClicks > 0 ? ((directTraffic?.clicks || 0) / totalClicks) * 100 : 0,
    },
    {
      name: "Referred",
      value: referredTraffic.reduce((sum, r) => sum + r.clicks, 0),
      percentage: totalClicks > 0 ? (referredTraffic.reduce((sum, r) => sum + r.clicks, 0) / totalClicks) * 100 : 0,
    },
  ];

  // Top UTM campaigns
  const topCampaigns = utmData.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Direct vs Referred */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Traffic Sources</h3>
          <p className="text-small text-default-500">Direct vs. referred traffic</p>
        </CardHeader>
        <CardBody className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Top Referrers List */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Top Referrers</h3>
          <p className="text-small text-default-500">Leading traffic sources</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {topReferrers.slice(0, 5).map((referrer, index) => (
              <div key={referrer.referrer} className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${index === 0 ? 'bg-primary' : 'bg-default-200'}`}>
                    <Icon
                      icon={getReferrerIcon(referrer.referrer)}
                      className={index === 0 ? 'text-white' : 'text-default-600'}
                      width={20}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-small">{getReferrerDomain(referrer.referrer)}</p>
                    <p className="text-tiny text-default-500">
                      {referrer.conversions} conversions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{referrer.clicks}</p>
                  <p className="text-tiny text-default-500">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Referrer Comparison Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Referrer Performance</h3>
          <p className="text-small text-default-500">Clicks vs conversions by source</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topReferrers}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="referrer"
                stroke="#888"
                fontSize={12}
                tickFormatter={getReferrerDomain}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
                labelFormatter={getReferrerDomain}
              />
              <Legend />
              <Bar dataKey="clicks" fill="#0ea5e9" name="Clicks" radius={[8, 8, 0, 0]} />
              <Bar dataKey="conversions" fill="#10b981" name="Conversions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* UTM Campaigns */}
      {utmData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">UTM Campaign Performance</h3>
            <p className="text-small text-default-500">Marketing campaign tracking</p>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-divider">
                    <th className="text-left p-3 text-small font-semibold">Source</th>
                    <th className="text-left p-3 text-small font-semibold">Medium</th>
                    <th className="text-left p-3 text-small font-semibold">Campaign</th>
                    <th className="text-right p-3 text-small font-semibold">Clicks</th>
                    <th className="text-right p-3 text-small font-semibold">Conversions</th>
                    <th className="text-right p-3 text-small font-semibold">CVR</th>
                  </tr>
                </thead>
                <tbody>
                  {topCampaigns.map((utm, index) => (
                    <tr key={`${utm.source}-${utm.medium}-${utm.campaign}`} className="border-b border-divider">
                      <td className="p-3">
                        <Chip size="sm" color="primary" variant="flat">
                          {utm.source}
                        </Chip>
                      </td>
                      <td className="p-3">
                        <Chip size="sm" color="secondary" variant="flat">
                          {utm.medium}
                        </Chip>
                      </td>
                      <td className="p-3 text-small">{utm.campaign}</td>
                      <td className="p-3 text-right font-semibold">{utm.clicks}</td>
                      <td className="p-3 text-right font-semibold text-success">{utm.conversions}</td>
                      <td className="p-3 text-right font-semibold">{utm.conversion_rate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

