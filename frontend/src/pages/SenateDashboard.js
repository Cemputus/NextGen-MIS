/**
 * Senate Dashboard - Smooth, Clean UI
 */
import React, { useState, useEffect } from 'react';
import { TrendingUp, Building2, FileText, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import ModernStatsCards from '../components/ModernStatsCards';
import RoleBasedCharts from '../components/RoleBasedCharts';
import ExportButtons from '../components/ExportButtons';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const SenateDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: filters
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const response = await axios.get(`/api/analytics/export/${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: filters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `senate-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Senate Dashboard</h1>
          <p className="text-muted-foreground">Institution-wide analytics and comprehensive reporting</p>
        </div>
        <ExportButtons stats={stats} filters={filters} filename="senate_dashboard" />
      </div>

      {/* Filters */}
      <GlobalFilterPanel onFilterChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground">Loading institution data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <ModernStatsCards stats={stats} type="general" />

          {/* Main Analytics */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="academics" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Academics
              </TabsTrigger>
              <TabsTrigger value="finance" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Finance
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Institution Overview</CardTitle>
                  <CardDescription>Comprehensive analytics across all faculties</CardDescription>
                </CardHeader>
                <CardContent>
                  <RoleBasedCharts filters={filters} type="institution" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>Institution-wide academic metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <RoleBasedCharts filters={filters} type="institution" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Revenue, budget, and financial performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    Financial analytics visualization
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Reports</CardTitle>
                  <CardDescription>Access and download comprehensive reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>No reports generated yet</p>
                      <p className="text-sm text-muted-foreground mt-2">Use the export buttons above to generate reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SenateDashboard;
