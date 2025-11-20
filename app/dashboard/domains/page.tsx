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
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
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

const TLDs = [
  { value: "com", label: ".com", price: 8.88 },
  { value: "net", label: ".net", price: 10.98 },
  { value: "org", label: ".org", price: 12.98 },
  { value: "io", label: ".io", price: 39.98 },
  { value: "co", label: ".co", price: 32.98 },
  { value: "xyz", label: ".xyz", price: 1.99 },
  { value: "app", label: ".app", price: 14.98 },
  { value: "dev", label: ".dev", price: 12.98 },
  { value: "ai", label: ".ai", price: 89.98 },
];

interface DomainSearchResult {
  domain: string;
  available: boolean;
  price?: number;
  renewPrice?: number;
  isPremium?: boolean;
}

export default function DomainsPage() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState<string | number>("my-domains");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { 
    isOpen: isPurchaseOpen, 
    onOpen: onPurchaseOpen, 
    onOpenChange: onPurchaseOpenChange 
  } = useDisclosure();

  // Domain search states
  const [domainSearchTerm, setDomainSearchTerm] = React.useState("");
  const [selectedTLDs, setSelectedTLDs] = React.useState(new Set(["com"]));
  const [searchResults, setSearchResults] = React.useState<DomainSearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedDomain, setSelectedDomain] = React.useState<DomainSearchResult | null>(null);
  const [isPurchasing, setIsPurchasing] = React.useState(false);

  const filteredItems = React.useMemo(() => {
    return domainsData.filter((domain) =>
      domain.domain.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue]);

  const activeDomains = domainsData.filter((d) => d.status === "active").length;
  const totalClicks = domainsData.reduce((acc, domain) => acc + domain.clicks, 0);
  const totalLinks = domainsData.reduce((acc, domain) => acc + domain.connectedLinks, 0);

  // Handle domain search
  const handleSearchDomains = async () => {
    if (!domainSearchTerm.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    try {
      // Build list of domains to check
      const domainsToCheck = Array.from(selectedTLDs).map(
        (tld) => `${domainSearchTerm.toLowerCase()}.${tld}`
      );

      const response = await fetch("/api/domains/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: domainsToCheck }),
      });

      const result = await response.json();

      if (result.error) {
        console.error("Search error:", result.error);
        // Show mock results on error (for demo purposes)
        setSearchResults(
          domainsToCheck.map((domain) => ({
            domain,
            available: Math.random() > 0.3,
            price: TLDs.find((t) => domain.endsWith(`.${t.value}`))?.price || 15.98,
            isPremium: false,
          }))
        );
      } else {
        setSearchResults(result.data || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Show mock results on error (for demo purposes)
      const domainsToCheck = Array.from(selectedTLDs).map(
        (tld) => `${domainSearchTerm.toLowerCase()}.${tld}`
      );
      setSearchResults(
        domainsToCheck.map((domain) => ({
          domain,
          available: Math.random() > 0.3,
          price: TLDs.find((t) => domain.endsWith(`.${t.value}`))?.price || 15.98,
          isPremium: false,
        }))
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Handle domain purchase
  const handlePurchaseDomain = async () => {
    if (!selectedDomain) return;

    setIsPurchasing(true);

    try {
      const response = await fetch("/api/domains/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain.domain,
          years: 1,
        }),
      });

      const result = await response.json();

      if (result.error) {
        alert(`Purchase failed: ${result.error}`);
      } else {
        alert(`Success! ${selectedDomain.domain} has been purchased. Order ID: ${result.data?.purchaseDetails?.orderId}`);
        onPurchaseOpenChange();
        setSelectedTab("my-domains");
        // In a real app, you'd refresh the domains list here
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Failed to purchase domain. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const myDomainsTab = (
    <div className="flex flex-col gap-4">
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
        topContent={
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
                  Connect Domain
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                Total {domainsData.length} domains
              </span>
            </div>
          </div>
        }
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

      {/* Connect Domain Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl">Connect Custom Domain</h2>
                <p className="text-small text-default-500 font-normal">
                  Connect your existing domain to your link in bio
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
                  Connect Domain
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );

  const buyDomainsTab = (
    <div className="flex flex-col gap-6">
      {/* Search Section */}
      <Card>
        <CardBody className="gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">Search for Your Perfect Domain</h3>
            <p className="text-small text-default-500">
              Find and register your ideal domain name through Namecheap
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-end">
              <Input
                label="Domain Name"
                placeholder="myawesomesite"
                value={domainSearchTerm}
                onValueChange={setDomainSearchTerm}
                className="flex-1"
                startContent={
                  <Icon icon="solar:global-linear" className="text-default-400" />
                }
                description="Enter your desired domain name without extension"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchDomains();
                  }
                }}
              />
              <Button
                color="primary"
                size="lg"
                onPress={handleSearchDomains}
                isLoading={isSearching}
                isDisabled={!domainSearchTerm.trim()}
                endContent={!isSearching && <Icon icon="solar:magnifer-linear" />}
              >
                Search
              </Button>
            </div>

            <div>
              <p className="text-small text-default-600 mb-2">Select TLDs to check:</p>
              <div className="flex flex-wrap gap-2">
                {TLDs.map((tld) => (
                  <Chip
                    key={tld.value}
                    color={selectedTLDs.has(tld.value) ? "primary" : "default"}
                    variant={selectedTLDs.has(tld.value) ? "solid" : "bordered"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newSet = new Set(selectedTLDs);
                      if (newSet.has(tld.value)) {
                        if (newSet.size > 1) newSet.delete(tld.value);
                      } else {
                        newSet.add(tld.value);
                      }
                      setSelectedTLDs(newSet);
                    }}
                  >
                    {tld.label} - ${tld.price}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div
                  key={result.domain}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    result.available
                      ? "border-success bg-success-50 dark:bg-success-900/10"
                      : "border-default-200 bg-default-50 dark:bg-default-900/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={
                        result.available
                          ? "solar:check-circle-bold"
                          : "solar:close-circle-bold"
                      }
                      className={result.available ? "text-success" : "text-danger"}
                      width={24}
                    />
                    <div>
                      <p className="font-semibold text-lg">{result.domain}</p>
                      <p className="text-small text-default-500">
                        {result.available ? (
                          <>
                            Available for registration
                            {result.isPremium && (
                              <Chip size="sm" color="warning" className="ml-2">
                                Premium
                              </Chip>
                            )}
                          </>
                        ) : (
                          "Already taken"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {result.available && result.price && (
                      <>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">
                            ${result.price}
                          </p>
                          <p className="text-tiny text-default-400">per year</p>
                        </div>
                        <Button
                          color="success"
                          variant="solid"
                          onPress={() => {
                            setSelectedDomain(result);
                            onPurchaseOpen();
                          }}
                        >
                          Purchase
                        </Button>
                      </>
                    )}
                    {!result.available && (
                      <Chip color="danger" variant="flat">
                        Unavailable
                      </Chip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Info Card */}
      {searchResults.length === 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <CardBody className="flex flex-row items-center gap-4">
            <Icon
              icon="solar:info-circle-bold"
              className="text-primary"
              width={48}
            />
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Why Buy Through Namecheap?
              </h3>
              <ul className="text-small text-default-600 space-y-1">
                <li>• Free WHOIS privacy protection</li>
                <li>• Competitive pricing and renewal rates</li>
                <li>• Easy domain management</li>
                <li>• Automatic DNS configuration</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Purchase Confirmation Modal */}
      <Modal isOpen={isPurchaseOpen} onOpenChange={onPurchaseOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl">Confirm Domain Purchase</h2>
                <p className="text-small text-default-500 font-normal">
                  Review your order details
                </p>
              </ModalHeader>
              <ModalBody>
                {selectedDomain && (
                  <div className="flex flex-col gap-4">
                    <Card className="bg-default-100">
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-small text-default-500">Domain</p>
                            <p className="text-xl font-bold">
                              {selectedDomain.domain}
                            </p>
                          </div>
                          <Chip color="success" variant="flat">
                            Available
                          </Chip>
                        </div>
                      </CardBody>
                    </Card>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-default-600">Registration (1 year)</span>
                        <span className="font-semibold">
                          ${selectedDomain.price?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-default-600">WHOIS Privacy</span>
                        <span className="font-semibold text-success">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-default-600">DNS Management</span>
                        <span className="font-semibold text-success">FREE</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-lg">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-primary">
                            ${selectedDomain.price?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                      <Icon
                        icon="solar:info-circle-bold"
                        className="text-warning mt-0.5"
                        width={20}
                      />
                      <p className="text-small text-warning-700 dark:text-warning-300">
                        This is a test purchase using Namecheap&apos;s sandbox environment.
                        No actual charges will be made.
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handlePurchaseDomain}
                  isLoading={isPurchasing}
                >
                  {isPurchasing ? "Processing..." : "Confirm Purchase"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Domains</h1>
          <p className="text-default-500 mt-1">
            Manage your custom domains or purchase new ones
          </p>
        </div>
      </div>

      <Tabs
        aria-label="Domain management tabs"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >
        <Tab
          key="my-domains"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="solar:folder-with-files-bold" width={20} />
              <span>My Domains</span>
              <Chip size="sm" variant="flat">{domainsData.length}</Chip>
            </div>
          }
        >
          {myDomainsTab}
        </Tab>
        <Tab
          key="buy-domains"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="solar:cart-large-2-bold" width={20} />
              <span>Buy Domains</span>
            </div>
          }
        >
          {buyDomainsTab}
        </Tab>
      </Tabs>
    </div>
  );
}
