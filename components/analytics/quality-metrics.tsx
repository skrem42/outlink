"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
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
} from "recharts";
import type { TrafficQuality } from "@/types/database";

interface QualityMetricsProps {
  quality: TrafficQuality;
}

export function QualityMetrics({ quality }: QualityMetricsProps) {
  const trafficData = [
    { name: "Human", value: quality.human_traffic, color: "#10b981" },
    { name: "Bot", value: quality.bot_traffic, color: "#ef4444" },
  ];

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getQualityScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Icon icon="solar:shield-check-linear" className="text-success" width={28} />
              <Chip size="sm" color={getQualityScoreColor(quality.quality_score)} variant="flat">
                {getQualityScoreLabel(quality.quality_score)}
              </Chip>
            </div>
            <p className="text-small text-default-500 mb-1">Quality Score</p>
            <p className={`text-4xl font-bold text-${getQualityScoreColor(quality.quality_score)}`}>
              {quality.quality_score.toFixed(0)}
            </p>
            <Progress
              value={quality.quality_score}
              color={getQualityScoreColor(quality.quality_score)}
              size="sm"
              className="mt-3"
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="solar:users-group-rounded-linear" className="text-success" width={24} />
              <p className="text-small text-default-500">Human Traffic</p>
            </div>
            <p className="text-4xl font-bold text-success">{quality.human_traffic.toLocaleString()}</p>
            <p className="text-tiny text-default-500 mt-1">
              {((quality.human_traffic / quality.total_traffic) * 100).toFixed(1)}% of total
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="solar:danger-circle-linear" className="text-danger" width={24} />
              <p className="text-small text-default-500">Bot Traffic</p>
            </div>
            <p className="text-4xl font-bold text-danger">{quality.bot_traffic.toLocaleString()}</p>
            <p className="text-tiny text-default-500 mt-1">
              {quality.bot_percentage.toFixed(1)}% of total
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="solar:eye-scan-linear" className="text-warning" width={24} />
              <p className="text-small text-default-500">Suspicious IPs</p>
            </div>
            <p className="text-4xl font-bold text-warning">{quality.suspicious_ips.length}</p>
            <p className="text-tiny text-default-500 mt-1">requires attention</p>
          </CardBody>
        </Card>
      </div>

      {/* Traffic Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Traffic Composition</h3>
            <p className="text-small text-default-500">Human vs. bot traffic distribution</p>
          </CardHeader>
          <CardBody className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Quality Indicators</h3>
            <p className="text-small text-default-500">Traffic health metrics</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:shield-check-bold" className="text-success" width={24} />
                  <div>
                    <p className="font-semibold text-success">Legitimate Traffic</p>
                    <p className="text-tiny text-default-500">Verified human visitors</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-success">
                  {((quality.human_traffic / quality.total_traffic) * 100).toFixed(0)}%
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-danger/10">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:shield-warning-bold" className="text-danger" width={24} />
                  <div>
                    <p className="font-semibold text-danger">Bot Activity</p>
                    <p className="text-tiny text-default-500">Automated traffic detected</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-danger">
                  {quality.bot_percentage.toFixed(0)}%
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:eye-scan-bold" className="text-warning" width={24} />
                  <div>
                    <p className="font-semibold text-warning">Suspicious Activity</p>
                    <p className="text-tiny text-default-500">IPs flagged for review</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-warning">
                  {quality.suspicious_ips.length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Suspicious IPs List */}
      {quality.suspicious_ips.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Suspicious IP Addresses</h3>
            <p className="text-small text-default-500">High-volume or abnormal activity detected</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quality.suspicious_ips.slice(0, 12).map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:danger-triangle-bold" className="text-warning" width={18} />
                    <code className="text-small font-mono">{ip}</code>
                  </div>
                  <Chip size="sm" color="warning" variant="flat">
                    Review
                  </Chip>
                </div>
              ))}
            </div>
            {quality.suspicious_ips.length > 12 && (
              <p className="text-small text-default-500 mt-4 text-center">
                +{quality.suspicious_ips.length - 12} more suspicious IPs
              </p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Security Recommendations</h3>
          <p className="text-small text-default-500">Improve traffic quality</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {quality.bot_percentage > 20 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-danger/10">
                <Icon icon="solar:shield-warning-bold" className="text-danger mt-1" width={20} />
                <div>
                  <p className="font-semibold text-danger">High Bot Traffic Detected</p>
                  <p className="text-small text-default-500 mt-1">
                    Consider implementing CAPTCHA or bot protection measures to reduce automated traffic.
                  </p>
                </div>
              </div>
            )}

            {quality.suspicious_ips.length > 5 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10">
                <Icon icon="solar:eye-scan-bold" className="text-warning mt-1" width={20} />
                <div>
                  <p className="font-semibold text-warning">Suspicious Activity Detected</p>
                  <p className="text-small text-default-500 mt-1">
                    Review and consider blocking IPs with abnormal traffic patterns to maintain quality metrics.
                  </p>
                </div>
              </div>
            )}

            {quality.quality_score >= 80 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10">
                <Icon icon="solar:verified-check-bold" className="text-success mt-1" width={20} />
                <div>
                  <p className="font-semibold text-success">Excellent Traffic Quality</p>
                  <p className="text-small text-default-500 mt-1">
                    Your traffic quality is excellent. Keep monitoring to maintain these standards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

