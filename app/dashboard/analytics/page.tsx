"use client";

import React, { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { ChartCard } from "@/components/chart-card";
import type { ChartCardProps } from "@/components/chart-card";
import AnalyticsChart from "@/components/analytics-chart";
import { useSearchParams, useRouter } from "next/navigation";
import {
  parseDate,
  getLocalTimeZone,
  today,
  CalendarDate,
  now,
} from "@internationalized/date";
import type { RangeValue } from "@heroui/date-picker";
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
} from "recharts";
import { api } from "@/lib/api-client";
import type { Link, AnalyticsData } from "@/types/database";

// KPI Stats data
const kpiStatsData: Omit<ChartCardProps, "index">[] = [
  {
    title: "Total Clicks",
    value: "24.5K",
    chartData: [
      { month: "January", value: 18200 },
      { month: "February", value: 22100 },
      { month: "March", value: 19800 },
      { month: "April", value: 23500 },
      { month: "May", value: 25800 },
      { month: "June", value: 24500 },
    ],
    icon: "solar:cursor-linear",
    change: "+12.5%",
    color: "primary",
    xaxis: "month",
  },
  {
    title: "Total Views",
    value: "32.8K",
    chartData: [
      { month: "January", value: 25000 },
      { month: "February", value: 28500 },
      { month: "March", value: 26500 },
      { month: "April", value: 30200 },
      { month: "May", value: 33500 },
      { month: "June", value: 32800 },
    ],
    icon: "solar:eye-linear",
    change: "+8.3%",
    color: "success",
    xaxis: "month",
  },
  {
    title: "Conversion Rate",
    value: "68.2%",
    chartData: [
      { month: "January", value: 62.1 },
      { month: "February", value: 64.4 },
      { month: "March", value: 63.2 },
      { month: "April", value: 65.8 },
      { month: "May", value: 67.5 },
      { month: "June", value: 68.2 },
    ],
    change: "+3.2%",
    color: "warning",
    icon: "solar:chart-linear",
    xaxis: "month",
  },
  {
    title: "Avg. Session",
    value: "2m 34s",
    chartData: [
      { month: "Monday", value: 145 },
      { month: "Tuesday", value: 165 },
      { month: "Wednesday", value: 151 },
      { month: "Thursday", value: 149 },
      { month: "Friday", value: 143 },
      { month: "Saturday", value: 140 },
      { month: "Sunday", value: 154 },
    ],
    change: "-1.2%",
    color: "default",
    icon: "solar:clock-circle-linear",
    xaxis: "day",
  },
  {
    title: "Bounce Rate",
    value: "36.5%",
    chartData: [
      { month: "January", value: 42.4 },
      { month: "February", value: 40.2 },
      { month: "March", value: 38.5 },
      { month: "April", value: 37.8 },
      { month: "May", value: 37.1 },
      { month: "June", value: 36.5 },
    ],
    change: "-5.9%",
    color: "secondary",
    icon: "solar:spedometer-max-linear",
    xaxis: "month",
  },
  {
    title: "Active Links",
    value: "32",
    chartData: [
      { month: "January", value: 28 },
      { month: "February", value: 29 },
      { month: "March", value: 30 },
      { month: "April", value: 30 },
      { month: "May", value: 31 },
      { month: "June", value: 32 },
    ],
    change: "+14.3%",
    color: "success",
    icon: "solar:link-circle-linear",
    xaxis: "month",
  },
];

// Analytics Chart data
const analyticsData = [
  {
    key: "unique-visitors",
    title: "Unique Visitors",
    suffix: "visitors",
    value: 147000,
    type: "number",
    change: "12.8%",
    changeType: "positive" as const,
    chartData: [
      { month: "Jan", value: 98000, lastYearValue: 43500 },
      { month: "Feb", value: 125000, lastYearValue: 38500 },
      { month: "Mar", value: 89000, lastYearValue: 58300 },
      { month: "Apr", value: 156000, lastYearValue: 35300 },
      { month: "May", value: 112000, lastYearValue: 89600 },
      { month: "Jun", value: 167000, lastYearValue: 56400 },
      { month: "Jul", value: 138000, lastYearValue: 45200 },
      { month: "Aug", value: 178000, lastYearValue: 84600 },
      { month: "Sep", value: 129000, lastYearValue: 73500 },
      { month: "Oct", value: 159000, lastYearValue: 65900 },
      { month: "Nov", value: 147000, lastYearValue: 82300 },
      { month: "Dec", value: 127000, lastYearValue: 95000 },
    ],
  },
  {
    key: "total-visits",
    title: "Total Visits",
    suffix: "visits",
    value: 623000,
    type: "number",
    change: "-2.1%",
    changeType: "neutral" as const,
    chartData: [
      { month: "Jan", value: 587000, lastYearValue: 243500 },
      { month: "Feb", value: 698000, lastYearValue: 318500 },
      { month: "Mar", value: 542000, lastYearValue: 258300 },
      { month: "Apr", value: 728000, lastYearValue: 335300 },
      { month: "May", value: 615000, lastYearValue: 289600 },
      { month: "Jun", value: 689000, lastYearValue: 256400 },
      { month: "Jul", value: 573000, lastYearValue: 245200 },
      { month: "Aug", value: 695000, lastYearValue: 384600 },
      { month: "Sep", value: 589000, lastYearValue: 273500 },
      { month: "Oct", value: 652000, lastYearValue: 365900 },
      { month: "Nov", value: 623000, lastYearValue: 282300 },
      { month: "Dec", value: 523000, lastYearValue: 295000 },
    ],
  },
  {
    key: "total-page-views",
    title: "Total Page Views",
    suffix: "views",
    value: 2312000,
    type: "number",
    change: "-5.7%",
    changeType: "negative" as const,
    chartData: [
      { month: "Jan", value: 2820000, lastYearValue: 1435000 },
      { month: "Feb", value: 2380000, lastYearValue: 1285000 },
      { month: "Mar", value: 2690000, lastYearValue: 1583000 },
      { month: "Apr", value: 2145000, lastYearValue: 1235000 },
      { month: "May", value: 2760000, lastYearValue: 1896000 },
      { month: "Jun", value: 2280000, lastYearValue: 1564000 },
      { month: "Jul", value: 2620000, lastYearValue: 1452000 },
      { month: "Aug", value: 2145000, lastYearValue: 1846000 },
      { month: "Sep", value: 2470000, lastYearValue: 1735000 },
      { month: "Oct", value: 2230000, lastYearValue: 1659000 },
      { month: "Nov", value: 2312000, lastYearValue: 1823000 },
      { month: "Dec", value: 2230000, lastYearValue: 1950000 },
    ],
  },
  {
    key: "bounce-rate",
    title: "Bounce Rate",
    value: 36.78,
    suffix: "bounce rate",
    type: "percentage",
    change: "2.4%",
    changeType: "positive" as const,
    chartData: [
      { month: "Jan", value: 42.82, lastYearValue: 25.12 },
      { month: "Feb", value: 35.95, lastYearValue: 18.45 },
      { month: "Mar", value: 39.25, lastYearValue: 22.85 },
      { month: "Apr", value: 34.58, lastYearValue: 15.92 },
      { month: "May", value: 40.92, lastYearValue: 24.38 },
      { month: "Jun", value: 35.15, lastYearValue: 16.75 },
      { month: "Jul", value: 38.75, lastYearValue: 21.45 },
      { month: "Aug", value: 33.95, lastYearValue: 17.82 },
      { month: "Sep", value: 39.65, lastYearValue: 23.15 },
      { month: "Oct", value: 35.85, lastYearValue: 19.95 },
      { month: "Nov", value: 36.78, lastYearValue: 20.45 },
      { month: "Dec", value: 34.78, lastYearValue: 18.25 },
    ],
  },
];

const deviceData = [
  { name: "Mobile", value: 65, color: "#0ea5e9" },
  { name: "Desktop", value: 25, color: "#8b5cf6" },
  { name: "Tablet", value: 10, color: "#ec4899" },
];

const topLinksData = [
  { name: "Instagram", clicks: 1234 },
  { name: "YouTube", clicks: 5678 },
  { name: "TikTok", clicks: 3456 },
  { name: "Twitter", clicks: 2341 },
  { name: "Portfolio", clicks: 892 },
];

const hourlyData = [
  { hour: "12AM", clicks: 45 },
  { hour: "3AM", clicks: 20 },
  { hour: "6AM", clicks: 35 },
  { hour: "9AM", clicks: 120 },
  { hour: "12PM", clicks: 250 },
  { hour: "3PM", clicks: 280 },
  { hour: "6PM", clicks: 320 },
  { hour: "9PM", clicks: 180 },
];

const COLORS = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const linkParam = searchParams.get("link");
  
  const [selectedLink, setSelectedLink] = React.useState(
    linkParam || "all"
  );

  // Get user's current timezone
  const userTimezone = getLocalTimeZone();
  const [timezone, setTimezone] = React.useState(userTimezone);

  // Date range state - default to last 7 days
  const [dateRange, setDateRange] = React.useState<RangeValue<CalendarDate>>({
    start: today(getLocalTimeZone()).subtract({ days: 7 }),
    end: today(getLocalTimeZone()),
  });

  // State for real data
  const [links, setLinks] = React.useState<Link[]>([]);
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null);
  const [isLoadingLinks, setIsLoadingLinks] = React.useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch links on mount
  React.useEffect(() => {
    fetchLinks();
  }, []);

  // Fetch analytics when filters change
  React.useEffect(() => {
    if (dateRange) {
      fetchAnalytics();
    }
  }, [selectedLink, dateRange]);

  const fetchLinks = async () => {
    try {
      setIsLoadingLinks(true);
      const data = await api.get<Link[]>("/api/links");
      setLinks(data);
    } catch (err) {
      console.error("Error fetching links:", err);
      setError("Failed to load links");
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const formatDateForAPI = (date: CalendarDate) => {
    return new Date(date.year, date.month - 1, date.day).toISOString();
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoadingAnalytics(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (selectedLink && selectedLink !== "all") {
        params.append("link_id", selectedLink);
      }
      
      if (dateRange?.start) {
        params.append("start_date", formatDateForAPI(dateRange.start));
      }
      
      if (dateRange?.end) {
        params.append("end_date", formatDateForAPI(dateRange.end));
      }

      const data = await api.get<AnalyticsData>(`/api/analytics?${params.toString()}`);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Comprehensive timezones with UTC offsets
  const timezones = [
    // UTC/GMT
    { value: "UTC", label: "(UTC+00:00) Coordinated Universal Time" },
    { value: "Etc/GMT", label: "(UTC+00:00) GMT" },
    
    // Americas - North America
    { value: "America/New_York", label: "(UTC-05:00) Eastern Time - New York" },
    { value: "America/Chicago", label: "(UTC-06:00) Central Time - Chicago" },
    { value: "America/Denver", label: "(UTC-07:00) Mountain Time - Denver" },
    { value: "America/Phoenix", label: "(UTC-07:00) Mountain Time - Phoenix (no DST)" },
    { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time - Los Angeles" },
    { value: "America/Anchorage", label: "(UTC-09:00) Alaska Time - Anchorage" },
    { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii Time - Honolulu" },
    { value: "America/Toronto", label: "(UTC-05:00) Eastern Time - Toronto" },
    { value: "America/Vancouver", label: "(UTC-08:00) Pacific Time - Vancouver" },
    { value: "America/Edmonton", label: "(UTC-07:00) Mountain Time - Edmonton" },
    { value: "America/Winnipeg", label: "(UTC-06:00) Central Time - Winnipeg" },
    { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time - Halifax" },
    { value: "America/St_Johns", label: "(UTC-03:30) Newfoundland Time - St. Johns" },
    
    // Americas - Mexico & Central America
    { value: "America/Mexico_City", label: "(UTC-06:00) Mexico City" },
    { value: "America/Cancun", label: "(UTC-05:00) Cancun" },
    { value: "America/Tijuana", label: "(UTC-08:00) Tijuana" },
    { value: "America/Guatemala", label: "(UTC-06:00) Guatemala City" },
    { value: "America/Costa_Rica", label: "(UTC-06:00) Costa Rica" },
    { value: "America/Panama", label: "(UTC-05:00) Panama" },
    
    // Americas - Caribbean
    { value: "America/Havana", label: "(UTC-05:00) Havana" },
    { value: "America/Jamaica", label: "(UTC-05:00) Jamaica" },
    { value: "America/Puerto_Rico", label: "(UTC-04:00) Puerto Rico" },
    { value: "America/Barbados", label: "(UTC-04:00) Barbados" },
    
    // Americas - South America
    { value: "America/Sao_Paulo", label: "(UTC-03:00) São Paulo" },
    { value: "America/Buenos_Aires", label: "(UTC-03:00) Buenos Aires" },
    { value: "America/Santiago", label: "(UTC-03:00) Santiago" },
    { value: "America/Lima", label: "(UTC-05:00) Lima" },
    { value: "America/Bogota", label: "(UTC-05:00) Bogotá" },
    { value: "America/Caracas", label: "(UTC-04:00) Caracas" },
    { value: "America/La_Paz", label: "(UTC-04:00) La Paz" },
    { value: "America/Montevideo", label: "(UTC-03:00) Montevideo" },
    { value: "America/Asuncion", label: "(UTC-04:00) Asunción" },
    { value: "America/Guyana", label: "(UTC-04:00) Georgetown" },
    
    // Europe - Western
    { value: "Europe/London", label: "(UTC+00:00) London" },
    { value: "Europe/Dublin", label: "(UTC+00:00) Dublin" },
    { value: "Europe/Lisbon", label: "(UTC+00:00) Lisbon" },
    { value: "Atlantic/Reykjavik", label: "(UTC+00:00) Reykjavik" },
    { value: "Atlantic/Azores", label: "(UTC-01:00) Azores" },
    { value: "Atlantic/Cape_Verde", label: "(UTC-01:00) Cape Verde" },
    
    // Europe - Central
    { value: "Europe/Paris", label: "(UTC+01:00) Paris" },
    { value: "Europe/Berlin", label: "(UTC+01:00) Berlin" },
    { value: "Europe/Rome", label: "(UTC+01:00) Rome" },
    { value: "Europe/Madrid", label: "(UTC+01:00) Madrid" },
    { value: "Europe/Brussels", label: "(UTC+01:00) Brussels" },
    { value: "Europe/Amsterdam", label: "(UTC+01:00) Amsterdam" },
    { value: "Europe/Vienna", label: "(UTC+01:00) Vienna" },
    { value: "Europe/Prague", label: "(UTC+01:00) Prague" },
    { value: "Europe/Warsaw", label: "(UTC+01:00) Warsaw" },
    { value: "Europe/Budapest", label: "(UTC+01:00) Budapest" },
    { value: "Europe/Stockholm", label: "(UTC+01:00) Stockholm" },
    { value: "Europe/Oslo", label: "(UTC+01:00) Oslo" },
    { value: "Europe/Copenhagen", label: "(UTC+01:00) Copenhagen" },
    { value: "Europe/Zurich", label: "(UTC+01:00) Zurich" },
    
    // Europe - Eastern
    { value: "Europe/Athens", label: "(UTC+02:00) Athens" },
    { value: "Europe/Bucharest", label: "(UTC+02:00) Bucharest" },
    { value: "Europe/Sofia", label: "(UTC+02:00) Sofia" },
    { value: "Europe/Helsinki", label: "(UTC+02:00) Helsinki" },
    { value: "Europe/Kiev", label: "(UTC+02:00) Kyiv" },
    { value: "Europe/Riga", label: "(UTC+02:00) Riga" },
    { value: "Europe/Tallinn", label: "(UTC+02:00) Tallinn" },
    { value: "Europe/Vilnius", label: "(UTC+02:00) Vilnius" },
    { value: "Europe/Istanbul", label: "(UTC+03:00) Istanbul" },
    { value: "Europe/Moscow", label: "(UTC+03:00) Moscow" },
    { value: "Europe/Minsk", label: "(UTC+03:00) Minsk" },
    
    // Africa
    { value: "Africa/Cairo", label: "(UTC+02:00) Cairo" },
    { value: "Africa/Johannesburg", label: "(UTC+02:00) Johannesburg" },
    { value: "Africa/Lagos", label: "(UTC+01:00) Lagos" },
    { value: "Africa/Nairobi", label: "(UTC+03:00) Nairobi" },
    { value: "Africa/Casablanca", label: "(UTC+01:00) Casablanca" },
    { value: "Africa/Algiers", label: "(UTC+01:00) Algiers" },
    { value: "Africa/Tunis", label: "(UTC+01:00) Tunis" },
    { value: "Africa/Accra", label: "(UTC+00:00) Accra" },
    { value: "Africa/Addis_Ababa", label: "(UTC+03:00) Addis Ababa" },
    
    // Middle East
    { value: "Asia/Dubai", label: "(UTC+04:00) Dubai" },
    { value: "Asia/Riyadh", label: "(UTC+03:00) Riyadh" },
    { value: "Asia/Kuwait", label: "(UTC+03:00) Kuwait" },
    { value: "Asia/Doha", label: "(UTC+03:00) Doha" },
    { value: "Asia/Bahrain", label: "(UTC+03:00) Bahrain" },
    { value: "Asia/Muscat", label: "(UTC+04:00) Muscat" },
    { value: "Asia/Baghdad", label: "(UTC+03:00) Baghdad" },
    { value: "Asia/Tehran", label: "(UTC+03:30) Tehran" },
    { value: "Asia/Amman", label: "(UTC+02:00) Amman" },
    { value: "Asia/Beirut", label: "(UTC+02:00) Beirut" },
    { value: "Asia/Jerusalem", label: "(UTC+02:00) Jerusalem" },
    { value: "Asia/Damascus", label: "(UTC+02:00) Damascus" },
    
    // Asia - South
    { value: "Asia/Kolkata", label: "(UTC+05:30) Kolkata" },
    { value: "Asia/Karachi", label: "(UTC+05:00) Karachi" },
    { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka" },
    { value: "Asia/Kathmandu", label: "(UTC+05:45) Kathmandu" },
    { value: "Asia/Colombo", label: "(UTC+05:30) Colombo" },
    
    // Asia - Southeast
    { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok" },
    { value: "Asia/Singapore", label: "(UTC+08:00) Singapore" },
    { value: "Asia/Kuala_Lumpur", label: "(UTC+08:00) Kuala Lumpur" },
    { value: "Asia/Jakarta", label: "(UTC+07:00) Jakarta" },
    { value: "Asia/Manila", label: "(UTC+08:00) Manila" },
    { value: "Asia/Ho_Chi_Minh", label: "(UTC+07:00) Ho Chi Minh" },
    { value: "Asia/Yangon", label: "(UTC+06:30) Yangon" },
    { value: "Asia/Phnom_Penh", label: "(UTC+07:00) Phnom Penh" },
    
    // Asia - East
    { value: "Asia/Shanghai", label: "(UTC+08:00) Shanghai" },
    { value: "Asia/Hong_Kong", label: "(UTC+08:00) Hong Kong" },
    { value: "Asia/Taipei", label: "(UTC+08:00) Taipei" },
    { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo" },
    { value: "Asia/Seoul", label: "(UTC+09:00) Seoul" },
    { value: "Asia/Pyongyang", label: "(UTC+09:00) Pyongyang" },
    { value: "Asia/Ulaanbaatar", label: "(UTC+08:00) Ulaanbaatar" },
    
    // Asia - Central
    { value: "Asia/Almaty", label: "(UTC+06:00) Almaty" },
    { value: "Asia/Tashkent", label: "(UTC+05:00) Tashkent" },
    { value: "Asia/Bishkek", label: "(UTC+06:00) Bishkek" },
    { value: "Asia/Dushanbe", label: "(UTC+05:00) Dushanbe" },
    { value: "Asia/Ashgabat", label: "(UTC+05:00) Ashgabat" },
    
    // Asia - North
    { value: "Asia/Yekaterinburg", label: "(UTC+05:00) Yekaterinburg" },
    { value: "Asia/Novosibirsk", label: "(UTC+07:00) Novosibirsk" },
    { value: "Asia/Krasnoyarsk", label: "(UTC+07:00) Krasnoyarsk" },
    { value: "Asia/Irkutsk", label: "(UTC+08:00) Irkutsk" },
    { value: "Asia/Yakutsk", label: "(UTC+09:00) Yakutsk" },
    { value: "Asia/Vladivostok", label: "(UTC+10:00) Vladivostok" },
    { value: "Asia/Magadan", label: "(UTC+11:00) Magadan" },
    { value: "Asia/Kamchatka", label: "(UTC+12:00) Kamchatka" },
    
    // Australia & Oceania
    { value: "Australia/Sydney", label: "(UTC+10:00) Sydney" },
    { value: "Australia/Melbourne", label: "(UTC+10:00) Melbourne" },
    { value: "Australia/Brisbane", label: "(UTC+10:00) Brisbane" },
    { value: "Australia/Perth", label: "(UTC+08:00) Perth" },
    { value: "Australia/Adelaide", label: "(UTC+09:30) Adelaide" },
    { value: "Australia/Darwin", label: "(UTC+09:30) Darwin" },
    { value: "Australia/Hobart", label: "(UTC+10:00) Hobart" },
    { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland" },
    { value: "Pacific/Fiji", label: "(UTC+12:00) Fiji" },
    { value: "Pacific/Guam", label: "(UTC+10:00) Guam" },
    { value: "Pacific/Port_Moresby", label: "(UTC+10:00) Port Moresby" },
    { value: "Pacific/Noumea", label: "(UTC+11:00) Noumea" },
    { value: "Pacific/Tahiti", label: "(UTC-10:00) Tahiti" },
    { value: "Pacific/Tongatapu", label: "(UTC+13:00) Tongatapu" },
    { value: "Pacific/Apia", label: "(UTC+13:00) Apia" },
  ];

  // Preset date ranges
  const presetRanges = [
    {
      label: "Last 24 Hours",
      getValue: () => ({
        start: today(getLocalTimeZone()).subtract({ days: 1 }),
        end: today(getLocalTimeZone()),
      }),
    },
    {
      label: "Last 7 Days",
      getValue: () => ({
        start: today(getLocalTimeZone()).subtract({ days: 7 }),
        end: today(getLocalTimeZone()),
      }),
    },
    {
      label: "Last 1 Month",
      getValue: () => ({
        start: today(getLocalTimeZone()).subtract({ months: 1 }),
        end: today(getLocalTimeZone()),
      }),
    },
    {
      label: "Last 3 Months",
      getValue: () => ({
        start: today(getLocalTimeZone()).subtract({ months: 3 }),
        end: today(getLocalTimeZone()),
      }),
    },
    {
      label: "Last 6 Months",
      getValue: () => ({
        start: today(getLocalTimeZone()).subtract({ months: 6 }),
        end: today(getLocalTimeZone()),
      }),
    },
    {
      label: "Last 1 Year",
      getValue: () => ({
        start: today(getLocalTimeZone()).subtract({ years: 1 }),
        end: today(getLocalTimeZone()),
      }),
    },
  ];

  // Update URL when link selection changes
  const handleLinkChange = (value: string) => {
    setSelectedLink(value);
    if (value === "all") {
      router.push("/dashboard/analytics");
    } else {
      router.push(`/dashboard/analytics?link=${value}`);
    }
  };

  // Handle preset selection
  const handlePresetClick = (getValue: () => RangeValue<CalendarDate>) => {
    setDateRange(getValue());
  };

  const selectedLinkData = React.useMemo(() => {
    if (selectedLink === "all") return null;
    return links.find((link) => link.id === selectedLink);
  }, [selectedLink, links]);

  // Transform analytics data for the main chart
  const transformedChartData = React.useMemo(() => {
    if (!analyticsData) {
      return analyticsData; // Will use mock data in component
    }

    // Transform chart_data to match AnalyticsChart format
    const chartDataWithComparison = analyticsData.chart_data.map((item) => ({
      month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.clicks,
      lastYearValue: Math.floor(item.clicks * 0.7), // Mock previous period for now
      views: item.views,
      conversions: item.conversions,
    }));

    return [
      {
        key: "total-clicks",
        title: "Total Clicks",
        suffix: "clicks",
        value: analyticsData.total_clicks,
        type: "number",
        change: "+12.8%", // TODO: Calculate from previous period
        changeType: "positive" as const,
        chartData: chartDataWithComparison,
      },
      {
        key: "total-views",
        title: "Total Views",
        suffix: "views",
        value: analyticsData.total_views,
        type: "number",
        change: "+8.5%", // TODO: Calculate from previous period
        changeType: "positive" as const,
        chartData: chartDataWithComparison.map(d => ({ ...d, value: d.views })),
      },
      {
        key: "conversions",
        title: "Conversions",
        suffix: "conversions",
        value: analyticsData.total_conversions,
        type: "number",
        change: "+15.2%", // TODO: Calculate from previous period
        changeType: "positive" as const,
        chartData: chartDataWithComparison.map(d => ({ ...d, value: d.conversions })),
      },
      {
        key: "conversion-rate",
        title: "Conversion Rate",
        value: analyticsData.conversion_rate,
        suffix: "%",
        type: "percentage",
        change: "+3.2%", // TODO: Calculate from previous period
        changeType: "positive" as const,
        chartData: chartDataWithComparison.map(d => ({
          ...d,
          value: d.conversions > 0 ? (d.conversions / d.value) * 100 : 0,
        })),
      },
    ];
  }, [analyticsData]);

  // Generate KPI data from analytics
  const computedKpiStats = React.useMemo((): Omit<ChartCardProps, "index">[] => {
    if (!analyticsData) {
      return kpiStatsData; // Return mock data as fallback
    }

    // Transform chart_data for mini sparklines
    const chartDataForSparkline = analyticsData.chart_data.slice(-30).map((item) => ({
      month: item.date,
      value: item.clicks,
    }));

    return [
      {
        title: "Total Clicks",
        value: analyticsData.total_clicks.toLocaleString(),
        chartData: chartDataForSparkline,
        icon: "solar:cursor-linear",
        change: "+12.5%", // TODO: Calculate from previous period
        color: "primary" as const,
        xaxis: "month" as const,
      },
      {
        title: "Total Views",
        value: analyticsData.total_views.toLocaleString(),
        chartData: analyticsData.chart_data.slice(-30).map((item) => ({
          month: item.date,
          value: item.views,
        })),
        icon: "solar:eye-linear",
        change: "+8.3%", // TODO: Calculate from previous period
        color: "success" as const,
        xaxis: "month" as const,
      },
      {
        title: "Conversion Rate",
        value: `${analyticsData.conversion_rate.toFixed(1)}%`,
        chartData: analyticsData.chart_data.slice(-30).map((item, idx) => ({
          month: item.date,
          value: item.conversions > 0 ? (item.conversions / item.clicks) * 100 : 0,
        })),
        change: "+3.2%", // TODO: Calculate from previous period
        color: "warning" as const,
        icon: "solar:chart-linear",
        xaxis: "month" as const,
      },
      {
        title: "Unique Visitors",
        value: analyticsData.unique_visitors.toLocaleString(),
        chartData: chartDataForSparkline.slice(-7).map((item, idx) => ({
          month: `Day ${idx + 1}`,
          value: Math.floor(item.value * 0.7), // Approximate unique from clicks
        })),
        change: "-1.2%", // TODO: Calculate from previous period
        color: "default" as const,
        icon: "solar:user-linear",
        xaxis: "day" as const,
      },
      {
        title: "Bounce Rate",
        value: `${analyticsData.bounce_rate.toFixed(1)}%`,
        chartData: analyticsData.chart_data.slice(-30).map((item) => ({
          month: item.date,
          value: analyticsData.bounce_rate + (Math.random() - 0.5) * 5, // Vary slightly
        })),
        change: "-5.9%", // TODO: Calculate from previous period
        color: "secondary" as const,
        icon: "solar:spedometer-max-linear",
        xaxis: "month" as const,
      },
      {
        title: "Active Links",
        value: links.filter(l => l.status).length.toString(),
        chartData: Array.from({ length: 6 }, (_, i) => ({
          month: `Month ${i + 1}`,
          value: links.filter(l => l.status).length + Math.floor(Math.random() * 5) - 2,
        })),
        change: "+14.3%", // TODO: Calculate from previous period
        color: "success" as const,
        icon: "solar:link-circle-linear",
        xaxis: "month" as const,
      },
    ];
  }, [analyticsData, links]);

  // Show loading state while links are loading
  if (isLoadingLinks) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading analytics..." />
      </div>
    );
  }

  // Show error state
  if (error && !analyticsData) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Icon icon="solar:danger-circle-bold" className="text-danger" width={48} />
        <p className="text-danger text-lg">{error}</p>
        <Button color="primary" onPress={fetchAnalytics}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
          <p className="text-default-500 mt-1 text-sm sm:text-base">
            {selectedLinkData
              ? `Analytics for ${selectedLinkData.domain}/${selectedLinkData.path}`
              : "Track your link performance and audience insights"}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              label="Select Link"
              className="w-full sm:w-64"
              selectedKeys={[selectedLink]}
              onChange={(e) => handleLinkChange(e.target.value)}
              size="sm"
              startContent={<Icon icon="solar:link-circle-linear" width={18} />}
              isDisabled={isLoadingLinks}
            >
              <SelectItem key="all" value="all">
                All Links
              </SelectItem>
              {links.map((link) => (
                <SelectItem key={link.id} value={link.id}>
                  {link.domain}/{link.path} ({link.clicks} clicks)
                </SelectItem>
              ))}
            </Select>
            <DateRangePicker
              label="Date Range"
              className="w-full sm:w-80"
              size="sm"
              value={dateRange}
              onChange={setDateRange}
              popoverProps={{
                offset: 13,
                placement: "bottom-start",
                classNames: {
                  content: "p-0",
                },
              }}
              CalendarBottomContent={
                <div className="flex border-t border-divider">
                  <div className="flex flex-col gap-1 p-3 border-r border-divider min-w-[160px]">
                    <p className="text-tiny font-semibold text-default-500 mb-1">Quick Select</p>
                    {presetRanges.map((preset) => (
                      <Button
                        key={preset.label}
                        size="sm"
                        variant="light"
                        className="justify-start h-8 text-small"
                        fullWidth
                        onPress={() => handlePresetClick(preset.getValue)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              label="Timezone"
              className="w-full sm:w-72"
              selectedKeys={[timezone]}
              onChange={(e) => setTimezone(e.target.value)}
              size="sm"
              startContent={<Icon icon="solar:clock-circle-linear" width={18} />}
            >
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </Select>
            <Button
              color="primary"
              startContent={<Icon icon="solar:download-linear" width={18} />}
              className="w-full sm:w-auto"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats - Hero UI Pro Style */}
      {isLoadingAnalytics ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading analytics..." />
        </div>
      ) : (
        <>
          <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {computedKpiStats.map((stat, index) => (
              <ChartCard key={index} {...stat} index={index} />
            ))}
          </dl>

          {/* Analytics Chart - Graph 2 */}
          {analyticsData && transformedChartData && <AnalyticsChart data={transformedChartData} />}

          {/* Empty state when no analytics data */}
          {!analyticsData && (
            <Card>
              <CardBody className="flex flex-col items-center justify-center py-12 gap-4">
                <Icon icon="solar:chart-bold-duotone" className="text-default-300" width={64} />
                <p className="text-lg font-semibold">No Analytics Data</p>
                <p className="text-default-500 text-center max-w-md">
                  There's no analytics data available for the selected period. 
                  {selectedLink !== "all" 
                    ? " This link may not have received any traffic yet." 
                    : " Try selecting a different date range or create some links to get started."}
                </p>
                <Button color="primary" onPress={() => router.push("/dashboard/links")}>
                  Go to Links
                </Button>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic by Hour */}
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Traffic by Hour</h3>
            <p className="text-small text-default-500">Peak engagement times</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="clicks" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Device Breakdown</h3>
            <p className="text-small text-default-500">Traffic by device type</p>
          </CardHeader>
          <CardBody className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Top Links */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">Top Performing Links</h3>
            <p className="text-small text-default-500">Most clicked links</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLinksData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#888"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="clicks" radius={[0, 8, 8, 0]}>
                  {topLinksData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Referral Sources */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Referral Sources</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { source: "Direct", percentage: 45, color: "bg-primary" },
              { source: "Social Media", percentage: 30, color: "bg-success" },
              { source: "Search Engines", percentage: 15, color: "bg-warning" },
              { source: "Email", percentage: 7, color: "bg-secondary" },
              { source: "Other", percentage: 3, color: "bg-default" },
            ].map((item) => (
              <div key={item.source} className="space-y-2">
                <div className="flex justify-between text-small">
                  <span>{item.source}</span>
                  <span className="font-semibold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-default-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="w-full flex items-center justify-center min-h-screen"><Icon icon="solar:loading-linear" className="animate-spin" width={40} /></div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
