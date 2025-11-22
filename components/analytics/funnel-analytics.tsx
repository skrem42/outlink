"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import type { FunnelStage } from "@/types/database";

interface FunnelAnalyticsProps {
  funnelStages: FunnelStage[];
}

export function FunnelAnalytics({ funnelStages }: FunnelAnalyticsProps) {
  const maxCount = Math.max(...funnelStages.map(s => s.count), 1);
  
  // Helper text for conversion tracking
  const conversionNote = "Conversions are manually tracked when users complete desired actions. OF API tracking integration coming soon for automatic conversion tracking.";

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "view":
        return "solar:eye-linear";
      case "click":
        return "solar:cursor-linear";
      case "conversion":
        return "solar:star-linear";
      default:
        return "solar:chart-linear";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "view":
        return "primary";
      case "click":
        return "warning";
      case "conversion":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Conversion Tracking Note */}
      <Card className="bg-primary/10 border-primary/20">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <Icon icon="solar:info-circle-bold" className="text-primary mt-0.5" width={20} />
            <div>
              <p className="text-small font-semibold text-primary mb-1">About Conversion Tracking</p>
              <p className="text-small text-default-600">
                <strong>Views</strong> = Landing page visits • <strong>Clicks</strong> = CTA button clicks • <strong>Conversions</strong> = Manual tracking (coming soon)
              </p>
              <p className="text-tiny text-default-500 mt-2">
                {conversionNote}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Funnel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {funnelStages.map((stage, index) => (
          <Card key={stage.stage}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-${getStageColor(stage.stage)}/10`}>
                  <Icon
                    icon={getStageIcon(stage.stage)}
                    className={`text-${getStageColor(stage.stage)}`}
                    width={24}
                  />
                </div>
                {index < funnelStages.length - 1 && (
                  <Icon
                    icon="solar:arrow-right-linear"
                    className="text-default-400"
                    width={24}
                  />
                )}
              </div>
              <p className="text-small text-default-500 capitalize mb-1">
                {stage.stage === 'view' ? 'Page Views' : stage.stage === 'click' ? 'CTA Clicks' : 'Conversions'}
              </p>
              <p className="text-3xl font-bold mb-2">{stage.count.toLocaleString()}</p>
              {stage.dropoff_rate > 0 && (
                <div className="flex items-center gap-1 text-small text-danger">
                  <Icon icon="solar:arrow-down-linear" width={16} />
                  <span>{stage.dropoff_rate.toFixed(1)}% drop-off</span>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Visual Funnel */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Conversion Funnel</h3>
          <p className="text-small text-default-500">User journey visualization</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 py-4">
            {funnelStages.map((stage, index) => {
              const widthPercentage = (stage.count / maxCount) * 100;
              const conversionRate = index === 0 
                ? 100 
                : ((stage.count / funnelStages[0].count) * 100);

              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-small mb-1">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={getStageIcon(stage.stage)}
                        className={`text-${getStageColor(stage.stage)}`}
                        width={20}
                      />
                      <span className="font-semibold capitalize">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{stage.count.toLocaleString()}</span>
                      <span className={`text-${getStageColor(stage.stage)}`}>
                        {conversionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Funnel Bar */}
                  <div className="relative">
                    <div
                      className={`h-16 rounded-lg bg-${getStageColor(stage.stage)} transition-all duration-500 flex items-center justify-center`}
                      style={{
                        width: `${widthPercentage}%`,
                        minWidth: '40%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                    >
                      <span className="text-white font-semibold">
                        {stage.count.toLocaleString()} users
                      </span>
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  {index < funnelStages.length - 1 && stage.dropoff_rate > 0 && (
                    <div className="flex items-center justify-center gap-2 text-small text-danger">
                      <Icon icon="solar:arrow-down-linear" width={16} />
                      <span>{stage.dropoff_rate.toFixed(1)}% dropped off</span>
                      <span className="text-default-500">
                        ({(stage.count - funnelStages[index + 1].count).toLocaleString()} users)
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:chart-2-linear" className="text-primary" width={24} />
              <p className="text-small text-default-500">Overall Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold">
              {funnelStages[0]?.count > 0
                ? ((funnelStages[funnelStages.length - 1]?.count / funnelStages[0]?.count) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-small text-default-500 mt-1">
              View to conversion
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:cursor-square-linear" className="text-warning" width={24} />
              <p className="text-small text-default-500">Click-Through Rate</p>
            </div>
            <p className="text-3xl font-bold">
              {funnelStages[0]?.count > 0
                ? ((funnelStages[1]?.count / funnelStages[0]?.count) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-small text-default-500 mt-1">
              Views to clicks
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon="solar:star-bold" className="text-success" width={24} />
              <p className="text-small text-default-500">Conversion Efficiency</p>
            </div>
            <p className="text-3xl font-bold">
              {funnelStages[1]?.count > 0
                ? ((funnelStages[2]?.count / funnelStages[1]?.count) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-small text-default-500 mt-1">
              Clicks to conversions
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

