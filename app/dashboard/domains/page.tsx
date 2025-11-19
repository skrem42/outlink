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
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Icon } from "@iconify/react";

// Sample data for domains
const domainsData = [
  {
    id: 1,
    domain: "sophierain.com",
    status: "active",
    verified: true,
    ssl: true,
    clicks: 45678,
    connectedLinks: 25,
    registeredDate: "2023-06-15",
    expiryDate: "2025-06-15",
    registrar: "GoDaddy",
  },
  {
    id: 2,
    domain: "bellapoarch.link",
    status: "active",
    verified: true,
    ssl: true,
    clicks: 23451,
    connectedLinks: 12,
    registeredDate: "2023-09-01",
    expiryDate: "2025-09-01",
    registrar: "Namecheap",
  },
  {
    id: 3,
    domain: "ameliarose.bio",
    status: "active",
    verified: true,
    ssl: true,
    clicks: 18900,
    connectedLinks: 8,
    registeredDate: "2024-01-10",
    expiryDate: "2025-01-10",
    registrar: "Cloudflare",
  },
  {
    id: 4,
    domain: "lunalove.com",
    status: "active",
    verified: true,
    ssl: true,
    clicks: 31245,
    connectedLinks: 15,
    registeredDate: "2023-08-20",
    expiryDate: "2025-08-20",
    registrar: "GoDaddy",
  },
  {
    id: 5,
    domain: "scarlettkiss.link",
    status: "pending",
    verified: false,
    ssl: false,
    clicks: 0,
    connectedLinks: 0,
    registeredDate: "2024-03-20",
    expiryDate: "2025-03-20",
    registrar: "Google Domains",
  },
  {
    id: 6,
    domain: "jadestone.bio",
    status: "active",
    verified: true,
    ssl: true,
    clicks: 27890,
    connectedLinks: 18,
    registeredDate: "2023-05-15",
    expiryDate: "2025-05-15",
    registrar: "Cloudflare",
  },
];

const statusColorMap = {
  active: "success",
  pending: "warning",
  expired: "danger",
} as const;

export default function DomainsPage() {
  const [filterValue, setFilterValue] = React.useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const filteredItems = React.useMemo(() => {
    return domainsData.filter((domain) =>
      domain.domain.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search domains..."
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              endContent={<Icon icon="solar:add-circle-linear" />}
              onPress={onOpen}
            >
              Add Domain
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {domainsData.length} domains
          </span>
        </div>
      </div>
    );
  }, [filterValue, onOpen]);

  const activeDomains = domainsData.filter((d) => d.status === "active").length;
  const totalClicks = domainsData.reduce((acc, domain) => acc + domain.clicks, 0);
  const totalLinks = domainsData.reduce((acc, domain) => acc + domain.connectedLinks, 0);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Domains</h1>
          <p className="text-default-500 mt-1">
            Manage your custom domains and DNS settings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Total Domains</p>
              <p className="text-2xl font-bold">{domainsData.length}</p>
            </div>
            <Icon
              icon="solar:global-bold"
              className="text-primary"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Active Domains</p>
              <p className="text-2xl font-bold">{activeDomains}</p>
            </div>
            <Icon
              icon="solar:check-circle-bold"
              className="text-success"
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
              className="text-warning"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Connected Links</p>
              <p className="text-2xl font-bold">{totalLinks}</p>
            </div>
            <Icon
              icon="solar:link-circle-bold"
              className="text-secondary"
              width={40}
            />
          </CardBody>
        </Card>
      </div>

      {/* Domains Table */}
      <Table
        aria-label="Domains table with actions"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn>DOMAIN</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>VERIFIED</TableColumn>
          <TableColumn>SSL</TableColumn>
          <TableColumn>CLICKS</TableColumn>
          <TableColumn>LINKS</TableColumn>
          <TableColumn>EXPIRY DATE</TableColumn>
          <TableColumn>REGISTRAR</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={filteredItems}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:global-linear" className="text-primary" width={20} />
                  <span className="font-semibold">{item.domain}</span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={statusColorMap[item.status]}
                  size="sm"
                  variant="flat"
                  className="capitalize"
                >
                  {item.status}
                </Chip>
              </TableCell>
              <TableCell>
                {item.verified ? (
                  <Chip
                    color="success"
                    size="sm"
                    variant="flat"
                    startContent={<Icon icon="solar:check-circle-bold" width={14} />}
                  >
                    Verified
                  </Chip>
                ) : (
                  <Chip
                    color="warning"
                    size="sm"
                    variant="flat"
                    startContent={<Icon icon="solar:clock-circle-bold" width={14} />}
                  >
                    Pending
                  </Chip>
                )}
              </TableCell>
              <TableCell>
                {item.ssl ? (
                  <Icon icon="solar:lock-password-bold" className="text-success" width={20} />
                ) : (
                  <Icon icon="solar:lock-password-unlocked-bold" className="text-danger" width={20} />
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:eye-bold" className="text-default-400" width={16} />
                  <span>{item.clicks.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:link-bold" className="text-default-400" width={16} />
                  <span>{item.connectedLinks}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-small">{item.expiryDate}</span>
                  <span className="text-tiny text-default-400">
                    {new Date(item.expiryDate) < new Date() ? (
                      <span className="text-danger">Expired</span>
                    ) : (
                      `${Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-small">{item.registrar}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="DNS Settings"
                  >
                    <Icon icon="solar:settings-linear" width={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Analytics"
                  >
                    <Icon icon="solar:chart-linear" width={18} />
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
                    <DropdownMenu aria-label="Domain actions">
                      <DropdownItem key="verify">Verify Domain</DropdownItem>
                      <DropdownItem key="ssl">Configure SSL</DropdownItem>
                      <DropdownItem key="dns">DNS Settings</DropdownItem>
                      <DropdownItem key="renew">Renew Domain</DropdownItem>
                      <DropdownItem key="transfer">Transfer Domain</DropdownItem>
                      <DropdownItem key="delete" className="text-danger" color="danger">
                        Remove Domain
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Domain Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl">Add Custom Domain</h2>
                <p className="text-small text-default-500 font-normal">
                  Connect your custom domain to your link in bio
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Domain Name"
                    placeholder="example.com"
                    startContent={
                      <Icon icon="solar:global-linear" className="text-default-400" />
                    }
                    description="Enter your domain without http:// or https://"
                  />
                  
                  <Card className="bg-default-100">
                    <CardBody>
                      <h3 className="text-medium font-semibold mb-2">DNS Configuration</h3>
                      <p className="text-small text-default-600 mb-3">
                        Add these DNS records to your domain registrar:
                      </p>
                      <div className="space-y-2">
                        <div className="bg-background p-3 rounded-lg">
                          <div className="grid grid-cols-3 gap-2 text-small">
                            <span className="font-semibold">Type:</span>
                            <span className="col-span-2">A</span>
                            <span className="font-semibold">Name:</span>
                            <span className="col-span-2">@</span>
                            <span className="font-semibold">Value:</span>
                            <span className="col-span-2">76.76.21.21</span>
                          </div>
                        </div>
                        <div className="bg-background p-3 rounded-lg">
                          <div className="grid grid-cols-3 gap-2 text-small">
                            <span className="font-semibold">Type:</span>
                            <span className="col-span-2">CNAME</span>
                            <span className="font-semibold">Name:</span>
                            <span className="col-span-2">www</span>
                            <span className="font-semibold">Value:</span>
                            <span className="col-span-2">cname.linkbio.io</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <div className="flex items-start gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <Icon icon="solar:info-circle-bold" className="text-primary mt-0.5" width={20} />
                    <p className="text-small text-primary-700 dark:text-primary-300">
                      DNS propagation can take up to 48 hours. We&apos;ll verify your domain automatically once the records are detected.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add Domain
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

