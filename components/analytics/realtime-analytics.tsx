"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import type { RealtimeData } from "@/types/database";

interface RealtimeAnalyticsProps {
  data: RealtimeData;
  autoRefresh?: boolean;
}

export function RealtimeAnalytics({ data, autoRefresh = false }: RealtimeAnalyticsProps) {
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // In a real implementation, this would trigger a refetch
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
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

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
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

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Icon icon="solar:user-linear" className="text-primary" width={24} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
                </div>
                <p className="text-small text-default-500">Active Now</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary">{data.active_visitors}</p>
            <p className="text-tiny text-default-500 mt-1">visitors online</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="solar:cursor-linear" className="text-warning" width={24} />
              <p className="text-small text-default-500">Last Hour</p>
            </div>
            <p className="text-4xl font-bold">{data.clicks_last_hour}</p>
            <p className="text-tiny text-default-500 mt-1">clicks</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon icon="solar:star-linear" className="text-success" width={24} />
              <p className="text-small text-default-500">Last Hour</p>
            </div>
            <p className="text-4xl font-bold text-success">{data.conversions_last_hour}</p>
            <p className="text-tiny text-default-500 mt-1">conversions</p>
          </CardBody>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Live Activity
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              </h3>
              <p className="text-small text-default-500">Recent events in real-time</p>
            </div>
            <Chip size="sm" color="success" variant="flat">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Chip>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.recent_events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-default-400">
                <Icon icon="solar:inbox-linear" width={48} />
                <p className="mt-2">No recent activity</p>
              </div>
            ) : (
              data.recent_events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-${getEventTypeColor(event.event_type)}/10`}>
                      <Icon
                        icon={getEventIcon(event.event_type)}
                        className={`text-${getEventTypeColor(event.event_type)}`}
                        width={18}
                      />
                    </div>
                    <div>
                      <p className="text-small font-medium capitalize">{event.event_type}</p>
                      <div className="flex items-center gap-2 text-tiny text-default-500">
                        {event.country && (
                          <span className="flex items-center gap-1">
                            <Icon icon="solar:map-point-linear" width={12} />
                            {event.country}
                            {event.city && `, ${event.city}`}
                          </span>
                        )}
                        {event.device_type && (
                          <span className="flex items-center gap-1">
                            <Icon icon="solar:device-linear" width={12} />
                            {event.device_type}
                          </span>
                        )}
                        {event.browser && (
                          <span className="flex items-center gap-1">
                            <Icon icon="solar:global-linear" width={12} />
                            {event.browser}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Chip
                      size="sm"
                      color={getEventTypeColor(event.event_type)}
                      variant="flat"
                    >
                      {formatTimestamp(event.timestamp)}
                    </Chip>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Geographic Live Distribution */}
      {data.recent_events.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Live Geographic Distribution</h3>
            <p className="text-small text-default-500">Where visitors are coming from</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {Array.from(
                new Set(data.recent_events.map(e => e.country).filter(Boolean))
              )
                .slice(0, 5)
                .map((country) => {
                  const count = data.recent_events.filter(e => e.country === country).length;
                  return (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:map-point-bold" className="text-primary" width={16} />
                        <span className="text-small font-medium">{country}</span>
                      </div>
                      <Badge content={count} color="primary" size="sm">
                        <div className="w-12" />
                      </Badge>
                    </div>
                  );
                })}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

