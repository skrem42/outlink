import type { AnalyticsData } from "@/types/database";

export interface ExportOptions {
  format: 'csv' | 'json';
  includeEvents: boolean;
  includeCharts: boolean;
}

export function exportToCSV(data: AnalyticsData, filename?: string): void {
  const csvRows = [];
  
  // Add summary metrics
  csvRows.push(['Metric', 'Value']);
  csvRows.push(['Total Clicks', data.total_clicks]);
  csvRows.push(['Total Views', data.total_views]);
  csvRows.push(['Total Conversions', data.total_conversions]);
  csvRows.push(['Unique Visitors', data.unique_visitors]);
  csvRows.push(['Bounce Rate', `${data.bounce_rate.toFixed(2)}%`]);
  csvRows.push(['Avg Session Duration', `${data.avg_session_duration}s`]);
  csvRows.push(['Conversion Rate', `${data.conversion_rate.toFixed(2)}%`]);
  csvRows.push(['Pages Per Session', data.pages_per_session.toFixed(2)]);
  csvRows.push([]);
  
  // Add chart data
  if (data.chart_data && data.chart_data.length > 0) {
    csvRows.push(['Date', 'Clicks', 'Views', 'Conversions']);
    data.chart_data.forEach(row => {
      csvRows.push([row.date, row.clicks, row.views, row.conversions]);
    });
    csvRows.push([]);
  }
  
  // Add geographic data
  if (data.geographic_data && data.geographic_data.length > 0) {
    csvRows.push(['Country', 'Clicks', 'Conversions', 'Conversion Rate']);
    data.geographic_data.forEach(geo => {
      csvRows.push([
        geo.country,
        geo.clicks,
        geo.conversions,
        `${geo.conversion_rate.toFixed(2)}%`
      ]);
    });
    csvRows.push([]);
  }
  
  // Add device breakdown
  if (data.device_breakdown && data.device_breakdown.length > 0) {
    csvRows.push(['Device Type', 'Count', 'Percentage']);
    data.device_breakdown.forEach(device => {
      csvRows.push([
        device.device_type,
        device.count,
        `${device.percentage.toFixed(2)}%`
      ]);
    });
    csvRows.push([]);
  }
  
  // Convert to CSV string
  const csvContent = csvRows.map(row => 
    row.map(cell => {
      const stringCell = String(cell);
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      if (stringCell.includes(',') || stringCell.includes('\n') || stringCell.includes('"')) {
        return `"${stringCell.replace(/"/g, '""')}"`;
      }
      return stringCell;
    }).join(',')
  ).join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `analytics-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: AnalyticsData, filename?: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `analytics-export-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePDFReport(data: AnalyticsData): void {
  // This would require a library like jsPDF or pdfmake
  // For now, we'll show a message
  alert('PDF export coming soon! Use CSV export for now.');
}

export function scheduleReport(
  frequency: 'daily' | 'weekly' | 'monthly',
  email: string,
  options: ExportOptions
): Promise<void> {
  // This would connect to a backend API to schedule reports
  return new Promise((resolve, reject) => {
    // Mock implementation
    console.log('Scheduling report:', { frequency, email, options });
    setTimeout(() => {
      alert(`Report scheduled to be sent ${frequency} to ${email}`);
      resolve();
    }, 1000);
  });
}

