"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/user";
import { Icon } from "@iconify/react";

// Sample data for creators
const creatorsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    totalLinks: 12,
    totalClicks: 15234,
    revenue: 1234.50,
    status: "active",
    joinedDate: "2024-01-15",
    tier: "premium",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@example.com",
    avatar: "https://i.pravatar.cc/150?u=mike",
    totalLinks: 8,
    totalClicks: 8976,
    revenue: 567.30,
    status: "active",
    joinedDate: "2024-02-01",
    tier: "pro",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    avatar: "https://i.pravatar.cc/150?u=emily",
    totalLinks: 25,
    totalClicks: 34521,
    revenue: 2891.20,
    status: "active",
    joinedDate: "2023-11-20",
    tier: "premium",
  },
  {
    id: 4,
    name: "David Park",
    email: "david.park@example.com",
    avatar: "https://i.pravatar.cc/150?u=david",
    totalLinks: 5,
    totalClicks: 2341,
    revenue: 123.45,
    status: "inactive",
    joinedDate: "2024-03-10",
    tier: "free",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    avatar: "https://i.pravatar.cc/150?u=lisa",
    totalLinks: 18,
    totalClicks: 19876,
    revenue: 1567.80,
    status: "active",
    joinedDate: "2024-01-05",
    tier: "pro",
  },
];

const statusColorMap = {
  active: "success",
  inactive: "danger",
} as const;

const tierColorMap = {
  free: "default",
  pro: "primary",
  premium: "secondary",
} as const;

export default function CreatorsPage() {
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredItems = React.useMemo(() => {
    let filtered = creatorsData;

    if (statusFilter !== "all") {
      filtered = filtered.filter((creator) => creator.status === statusFilter);
    }

    if (filterValue) {
      filtered = filtered.filter(
        (creator) =>
          creator.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          creator.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  }, [filterValue, statusFilter]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name or email..."
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" endContent={<Icon icon="solar:alt-arrow-down-linear" />}>
                  Status: {statusFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                selectedKeys={[statusFilter]}
                selectionMode="single"
                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
              >
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="active">Active</DropdownItem>
                <DropdownItem key="inactive">Inactive</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<Icon icon="solar:user-plus-linear" />}
            >
              Invite Creator
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} creators
          </span>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, filteredItems.length]);

  const totalRevenue = creatorsData.reduce((acc, creator) => acc + creator.revenue, 0);
  const activeCreators = creatorsData.filter((c) => c.status === "active").length;
  const totalClicks = creatorsData.reduce((acc, creator) => acc + creator.totalClicks, 0);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Creators</h1>
          <p className="text-default-500 mt-1">
            Manage your creator network and track performance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Total Creators</p>
              <p className="text-2xl font-bold">{creatorsData.length}</p>
            </div>
            <Icon
              icon="solar:users-group-rounded-bold"
              className="text-primary"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Active Creators</p>
              <p className="text-2xl font-bold">{activeCreators}</p>
            </div>
            <Icon
              icon="solar:user-check-bold"
              className="text-success"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <Icon
              icon="solar:dollar-minimalistic-bold"
              className="text-warning"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Total Clicks</p>
              <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
            </div>
            <Icon
              icon="solar:cursor-bold"
              className="text-secondary"
              width={40}
            />
          </CardBody>
        </Card>
      </div>

      {/* Creators Table */}
      <Table
        aria-label="Creators table with actions"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn>CREATOR</TableColumn>
          <TableColumn>TIER</TableColumn>
          <TableColumn>LINKS</TableColumn>
          <TableColumn>CLICKS</TableColumn>
          <TableColumn>REVENUE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>JOINED</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={filteredItems}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <User
                  avatarProps={{ src: item.avatar }}
                  description={item.email}
                  name={item.name}
                />
              </TableCell>
              <TableCell>
                <Chip
                  color={tierColorMap[item.tier]}
                  size="sm"
                  variant="flat"
                  className="capitalize"
                >
                  {item.tier}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:link-bold" className="text-default-400" width={16} />
                  <span>{item.totalLinks}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:eye-bold" className="text-default-400" width={16} />
                  <span>{item.totalClicks.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-success">
                  ${item.revenue.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[item.status]}
                  size="sm"
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>{item.joinedDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="View"
                  >
                    <Icon icon="solar:eye-linear" width={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Edit"
                  >
                    <Icon icon="solar:pen-linear" width={18} />
                  </Button>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="More options"
                      >
                        <Icon icon="solar:menu-dots-bold" width={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Creator actions">
                      <DropdownItem key="analytics">View Analytics</DropdownItem>
                      <DropdownItem key="message">Send Message</DropdownItem>
                      <DropdownItem key="upgrade">Upgrade Plan</DropdownItem>
                      <DropdownItem key="suspend" className="text-danger" color="danger">
                        Suspend Account
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

