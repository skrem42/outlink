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
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { NewLinkDrawer } from "@/components/new-link-drawer";
import { LinkTypeSwitcher } from "@/components/link-type-switcher";
import { api } from "@/lib/api-client";
import type { Link } from "@/types/database";
import { addToast } from "@heroui/toast";

// Default domains
const defaultDomains = [
  "outlink.bio",
  "clickfor.bio",
  "clickfor.links",
  "tapfor.links",
];

// Custom domains (including girly OF names)
const customDomains = [
  "sophierain.com",
  "bellapoarch.link",
  "ameliarose.bio",
  "lunalove.com",
  "scarlettkiss.link",
  "jadestone.bio",
];

const allDomains = [...defaultDomains, ...customDomains];

export default function LinksPage() {
  const router = useRouter();
  const [linksData, setLinksData] = React.useState<Link[]>([]);
  const [editedLinks, setEditedLinks] = React.useState<Map<string, Partial<Link>>>(new Map());
  const [filterValue, setFilterValue] = React.useState("");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch links on mount
  React.useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.get<Link[]>("/api/links");
      setLinksData(data);
    } catch (err) {
      setError("Failed to load links. Please try again.");
      console.error("Error fetching links:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainChange = (id: string, domain: string) => {
    setLinksData((prev) =>
      prev.map((link) => (link.id === id ? { ...link, domain } : link))
    );
    setEditedLinks((prev) => {
      const updated = new Map(prev);
      const existing = updated.get(id) || {};
      updated.set(id, { ...existing, domain });
      return updated;
    });
  };

  const handlePathChange = (id: string, path: string) => {
    setLinksData((prev) =>
      prev.map((link) => (link.id === id ? { ...link, path } : link))
    );
    setEditedLinks((prev) => {
      const updated = new Map(prev);
      const existing = updated.get(id) || {};
      updated.set(id, { ...existing, path });
      return updated;
    });
  };

  const handleStatusChange = (id: string, status: boolean) => {
    setLinksData((prev) =>
      prev.map((link) => (link.id === id ? { ...link, status } : link))
    );
    setEditedLinks((prev) => {
      const updated = new Map(prev);
      const existing = updated.get(id) || {};
      updated.set(id, { ...existing, status });
      return updated;
    });
  };

  const handleLinkTypeChange = (id: string, link_type: "whitehat" | "greyhat" | "blackhat") => {
    setLinksData((prev) =>
      prev.map((link) => (link.id === id ? { ...link, link_type } : link))
    );
    setEditedLinks((prev) => {
      const updated = new Map(prev);
      const existing = updated.get(id) || {};
      updated.set(id, { ...existing, link_type });
      return updated;
    });
  };

  const handleApplyChanges = async () => {
    try {
      // Update all edited links
      const updatePromises = Array.from(editedLinks.entries()).map(
        ([id, updates]) => api.patch(`/api/links/${id}`, updates)
      );

      await Promise.all(updatePromises);
      addToast({
        title: "Changes Applied",
        description: "Changes saved! May take up to 20 minutes for changes to take effect.",
        color: "primary",
      });
      setEditedLinks(new Map());
      fetchLinks(); // Refresh the list
    } catch (err) {
      addToast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        color: "danger",
      });
      console.error("Error updating links:", err);
    }
  };

  const handleCopyLink = (domain: string, path: string) => {
    const fullUrl = `https://${domain}/${path}`;
    navigator.clipboard.writeText(fullUrl);
    addToast({
      title: "Success",
      description: "Link copied to clipboard!",
      color: "success",
    });
  };

  const handleViewAnalytics = (linkId: string) => {
    router.push(`/dashboard/analytics?link=${linkId}`);
  };

  const handleDrawerSuccess = () => {
    fetchLinks(); // Refresh links list from API
    showToast("Link created successfully!");
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await api.delete(`/api/links/${linkId}`);
      showToast("Link deleted successfully!");
      fetchLinks(); // Refresh the list
    } catch (err) {
      showToast("Failed to delete link. Please try again.");
      console.error("Error deleting link:", err);
    }
  };

  const filteredItems = React.useMemo(() => {
    return linksData.filter(
      (link) =>
        link.domain.toLowerCase().includes(filterValue.toLowerCase()) ||
        link.path.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, linksData]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by domain or path..."
            startContent={<Icon icon="solar:magnifer-linear" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
          <div className="flex gap-3">
            {editedLinks.size > 0 && (
              <Button
                color="success"
                startContent={<Icon icon="solar:check-circle-linear" />}
                onPress={handleApplyChanges}
              >
                Apply Changes ({editedLinks.size})
              </Button>
            )}
            <Button
              color="primary"
              endContent={<Icon icon="solar:add-circle-linear" />}
              onPress={() => setIsDrawerOpen(true)}
            >
              Add New Link
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {linksData.length} links
          </span>
        </div>
      </div>
    );
  }, [filterValue, editedLinks.size, linksData.length]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading links..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Icon icon="solar:danger-circle-bold" className="text-danger" width={48} />
        <p className="text-danger">{error}</p>
        <Button color="primary" onPress={fetchLinks}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Links</h1>
          <p className="text-default-500 mt-1">
            Manage all your bio links in one place
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Total Links</p>
              <p className="text-2xl font-bold">{linksData.length}</p>
            </div>
            <Icon
              icon="solar:link-circle-bold"
              className="text-primary"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Total Clicks</p>
              <p className="text-2xl font-bold">
                {linksData
                  .reduce((acc, link) => acc + link.clicks, 0)
                  .toLocaleString()}
              </p>
            </div>
            <Icon
              icon="solar:cursor-bold"
              className="text-success"
              width={40}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-small text-default-500">Active Links</p>
              <p className="text-2xl font-bold">
                {linksData.filter((l) => l.status).length}
              </p>
            </div>
            <Icon
              icon="solar:check-circle-bold"
              className="text-warning"
              width={40}
            />
          </CardBody>
        </Card>
      </div>

      {/* Links Table */}
      <Table
        aria-label="Links table with inline editing"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader>
          <TableColumn width={150}>TYPE</TableColumn>
          <TableColumn width={200}>DOMAIN</TableColumn>
          <TableColumn>PATH</TableColumn>
          <TableColumn width={100}>CLICKS</TableColumn>
          <TableColumn width={100}>STATUS</TableColumn>
          <TableColumn width={150}>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={filteredItems}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <LinkTypeSwitcher
                  value={item.link_type}
                  onChange={(value) => handleLinkTypeChange(item.id, value)}
                />
              </TableCell>
              <TableCell>
                <Select
                  size="sm"
                  selectedKeys={[item.domain]}
                  className="min-w-[180px]"
                  onChange={(e) => handleDomainChange(item.id, e.target.value)}
                  aria-label="Select domain"
                  >
                    {allDomains.map((domain) => (
                      <SelectItem key={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </Select>
              </TableCell>
              <TableCell>
                <Input
                  size="sm"
                  value={item.path}
                  onChange={(e) => handlePathChange(item.id, e.target.value)}
                  startContent={
                    <span className="text-default-400 text-small">/</span>
                  }
                  classNames={{
                    input: "font-mono",
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Icon
                    icon="solar:eye-bold"
                    className="text-default-400"
                    width={16}
                  />
                  <span>{item.clicks.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  size="sm"
                  isSelected={item.status}
                  onValueChange={(checked) =>
                    handleStatusChange(item.id, checked)
                  }
                  aria-label="Toggle link status"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {(item.link_type === "whitehat" || item.link_type === "greyhat") && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      aria-label="Customize landing page"
                      onPress={() =>
                        router.push(`/dashboard/links/customize/${item.id}`)
                      }
                    >
                      <Icon icon="solar:palette-linear" width={18} />
                    </Button>
                  )}
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Copy link"
                    onPress={() => handleCopyLink(item.domain, item.path)}
                  >
                    <Icon icon="solar:copy-linear" width={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="View analytics"
                    onPress={() => handleViewAnalytics(item.id)}
                  >
                    <Icon icon="solar:chart-linear" width={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    aria-label="Delete"
                    onPress={() => handleDeleteLink(item.id)}
                  >
                    <Icon icon="solar:trash-bin-trash-linear" width={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* New Link Drawer */}
      <NewLinkDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
}
