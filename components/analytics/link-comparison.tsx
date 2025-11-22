"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import type { LinkPerformance } from "@/types/database";

interface LinkComparisonProps {
  links: LinkPerformance[];
}

export function LinkComparison({ links }: LinkComparisonProps) {
  const topLinks = links.slice(0, 10);
  
  const getHealthColor = (score: number) => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "warning";
    if (rank === 2) return "default";
    if (rank === 3) return "secondary";
    return "default";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "solar:cup-star-bold";
    if (rank === 2) return "solar:medal-star-bold";
    if (rank === 3) return "solar:medal-ribbons-star-bold";
    return "solar:star-linear";
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Top 3 Links Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topLinks.slice(0, 3).map((link, index) => (
          <Card key={link.link_id} className={index === 0 ? "md:order-2" : index === 1 ? "md:order-1" : "md:order-3"}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon
                  icon={getRankIcon(link.rank)}
                  className={`text-${getRankBadgeColor(link.rank)}`}
                  width={32}
                />
                <Chip size="sm" color={getRankBadgeColor(link.rank)} variant="flat">
                  #{link.rank}
                </Chip>
              </div>
              <p className="text-small text-default-500 mb-1">Top Link</p>
              <p className="font-bold text-lg mb-1">{link.domain}/{link.path}</p>
              <div className="flex items-center gap-2 text-tiny text-default-500 mb-4">
                <span>{link.clicks} clicks</span>
                <span>•</span>
                <span>{link.conversions} conversions</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-small">
                  <span>Health Score</span>
                  <span className={`font-semibold text-${getHealthColor(link.health_score)}`}>
                    {link.health_score.toFixed(0)}/100
                  </span>
                </div>
                <Progress
                  value={link.health_score}
                  color={getHealthColor(link.health_score)}
                  size="sm"
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Performance Ranking Table */}
      <Card>
        <CardHeader className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Link Performance Ranking</h3>
          <p className="text-small text-default-500">Complete performance breakdown</p>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left p-3 text-small font-semibold">Rank</th>
                  <th className="text-left p-3 text-small font-semibold">Link</th>
                  <th className="text-right p-3 text-small font-semibold">Clicks</th>
                  <th className="text-right p-3 text-small font-semibold">Conversions</th>
                  <th className="text-right p-3 text-small font-semibold">CVR</th>
                  <th className="text-right p-3 text-small font-semibold">CTR</th>
                  <th className="text-right p-3 text-small font-semibold">Health</th>
                </tr>
              </thead>
              <tbody>
                {topLinks.map((link, index) => (
                  <tr
                    key={link.link_id}
                    className={`border-b border-divider ${index < 3 ? 'bg-default-50' : ''}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <Icon
                            icon={getRankIcon(link.rank)}
                            className={`text-${getRankBadgeColor(link.rank)}`}
                            width={18}
                          />
                        )}
                        <span className="font-semibold">#{link.rank}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-small">{link.domain}/{link.path}</p>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">{link.clicks.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Chip size="sm" color="success" variant="flat">
                        {link.conversions}
                      </Chip>
                    </td>
                    <td className="p-3 text-right font-semibold">{link.conversion_rate.toFixed(1)}%</td>
                    <td className="p-3 text-right font-semibold">{link.ctr.toFixed(1)}%</td>
                    <td className="p-3 text-right">
                      <Chip size="sm" color={getHealthColor(link.health_score)} variant="flat">
                        {link.health_score.toFixed(0)}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Performance Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Performing Links */}
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Best Performing</h3>
            <p className="text-small text-default-500">Top 5 by conversion rate</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[...topLinks]
                .sort((a, b) => b.conversion_rate - a.conversion_rate)
                .slice(0, 5)
                .map((link, index) => (
                  <div key={link.link_id} className="space-y-2">
                    <div className="flex items-center justify-between text-small">
                      <span className="font-medium">{link.domain}/{link.path}</span>
                      <span className="text-success font-semibold">{link.conversion_rate.toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={link.conversion_rate}
                      color="success"
                      size="sm"
                    />
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>

        {/* Links Need Attention */}
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Needs Attention</h3>
            <p className="text-small text-default-500">Low health score links</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[...topLinks]
                .sort((a, b) => a.health_score - b.health_score)
                .slice(0, 5)
                .map((link, index) => (
                  <div key={link.link_id} className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                    <div>
                      <p className="font-medium text-small">{link.domain}/{link.path}</p>
                      <p className="text-tiny text-default-500">{link.clicks} clicks • {link.conversions} conversions</p>
                    </div>
                    <div className="text-right">
                      <Chip size="sm" color={getHealthColor(link.health_score)} variant="flat">
                        {link.health_score.toFixed(0)}
                      </Chip>
                      <p className="text-tiny text-default-500 mt-1">health score</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

