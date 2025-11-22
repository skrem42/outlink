"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Progress } from "@heroui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Treemap,
  Cell,
} from "recharts";
import type { GeographicData } from "@/types/database";

interface GeoAnalyticsProps {
  data: GeographicData[];
}

const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#f97316"];

export function GeoAnalytics({ data }: GeoAnalyticsProps) {
  const topCountries = data.slice(0, 10);
  const topCities = data
    .flatMap(country => 
      country.cities.map(city => ({
        country: country.country,
        city: city.city,
        clicks: city.clicks,
        conversions: city.conversions,
      }))
    )
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Prepare treemap data
  const treemapData = topCountries.map(country => ({
    name: country.country,
    size: country.clicks,
    children: country.cities.slice(0, 3).map(city => ({
      name: city.city,
      size: city.clicks,
    })),
  }));

  // Get country flag emoji (simplified)
  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Geographic Heatmap */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Geographic Distribution</h3>
          <p className="text-small text-default-500">Traffic volume by location</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#0ea5e9"
            >
              {treemapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Top Countries Table */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Top Countries</h3>
          <p className="text-small text-default-500">Traffic by country</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {topCountries.map((country, index) => (
              <div key={country.country} className="space-y-2">
                <div className="flex items-center justify-between text-small">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag(country.country_code)}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-default-500">{country.clicks} clicks</span>
                    <span className="text-success">{country.conversion_rate.toFixed(1)}% CVR</span>
                  </div>
                </div>
                <Progress
                  value={(country.clicks / topCountries[0].clicks) * 100}
                  color={index === 0 ? "primary" : "default"}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Top Cities */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Top Cities</h3>
          <p className="text-small text-default-500">Most active cities</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topCities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis type="number" stroke="#888" fontSize={12} />
              <YAxis
                type="category"
                dataKey="city"
                stroke="#888"
                fontSize={12}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="clicks" radius={[0, 8, 8, 0]}>
                {topCities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Conversion Rate by Country */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Conversion Rate by Country</h3>
          <p className="text-small text-default-500">Performance metrics per location</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCountries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="country" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="clicks" fill="#0ea5e9" name="Clicks" radius={[8, 8, 0, 0]} />
              <Bar dataKey="conversions" fill="#10b981" name="Conversions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
}

