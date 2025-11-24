/**
 * FEX Analytics Page - Modern UI with Data Loading
 * Comprehensive FEX analysis with drilldown capabilities
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, AlertTriangle, FileText, Download, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { KPICard } from '../components/ui/kpi-card';
import { DashboardGrid } from '../components/ui/dashboard-grid';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import ExportButtons from '../components/ExportButtons';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

const FEXAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [fexData, setFexData] = useState(null);
  const [drilldown, setDrilldown] = useState('overall');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadFEXData();
  }, [filters, drilldown]);

  const loadFEXData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/analytics/fex', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { ...filters, drilldown }
      });
      
      // Ensure we have valid data structure
      if (response.data && response.data.data) {
        setFexData(response.data);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where API returns array directly
        const summary = {
          total_fex: response.data.reduce((sum, item) => sum + (item.total_fex || 0), 0),
          total_mex: response.data.reduce((sum, item) => sum + (item.total_mex || 0), 0),
          total_fcw: response.data.reduce((sum, item) => sum + (item.total_fcw || 0), 0),
          total_completed: response.data.reduce((sum, item) => sum + (item.total_completed || 0), 0),
          fex_rate: 0
        };
        const totalExams = summary.total_fex + summary.total_mex + summary.total_fcw + summary.total_completed;
        summary.fex_rate = totalExams > 0 ? (summary.total_fex / totalExams * 100).toFixed(2) : 0;
        setFexData({ data: response.data, summary });
      } else {
        setFexData({ data: [], summary: { total_fex: 0, total_mex: 0, total_fcw: 0, total_completed: 0, fex_rate: 0 } });
      }
    } catch (err) {
      console.error('Error loading FEX data:', err);
      // Don't set empty data on error, keep previous data or show error
      if (!fexData) {
        setFexData({ data: [], summary: { total_fex: 0, total_mex: 0, total_fcw: 0, total_completed: 0, fex_rate: 0 } });
      }
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#06b6d4'];

  // Prepare chart data
  const chartData = fexData?.data || [];
  const getDataKey = () => {
    if (drilldown === 'faculty') return 'faculty_name';
    if (drilldown === 'department') return 'department';
    if (drilldown === 'program') return 'program_name';
    if (drilldown === 'course') return 'course_name';
    return 'faculty_name';
  };

  const summary = fexData?.summary || {
    total_fex: 0,
    total_mex: 0,
    total_fcw: 0,
    total_completed: 0,
    fex_rate: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FEX Analytics</h1>
          <p className="text-muted-foreground">Failed Exam Analysis with Drilldown Capabilities</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select
            value={drilldown}
            onChange={(e) => setDrilldown(e.target.value)}
            className="w-48"
          >
            <option value="overall">Overall</option>
            <option value="faculty">By Faculty</option>
            <option value="department">By Department</option>
            <option value="program">By Program</option>
            <option value="course">By Course</option>
          </Select>
          <ExportButtons data={fexData?.data} filters={{ ...filters, drilldown }} filename="fex_analytics" />
        </div>
      </div>

      {/* Global Filter Panel */}
      <GlobalFilterPanel onFilterChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground">Loading FEX analytics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <DashboardGrid cols={{ default: 2, sm: 2, md: 4 }}>
            <KPICard
              title="Total FEX"
              value={summary.total_fex || 0}
              icon={AlertTriangle}
              subtitle="Failed exams"
              changeType={summary.total_fex > 0 ? 'negative' : 'neutral'}
            />
            <KPICard
              title="FEX Rate"
              value={`${summary.fex_rate || 0}%`}
              icon={TrendingDown}
              subtitle="Failure rate"
              changeType={summary.fex_rate > 10 ? 'negative' : summary.fex_rate > 5 ? 'neutral' : 'positive'}
            />
            <KPICard
              title="Total MEX"
              value={summary.total_mex || 0}
              icon={FileText}
              subtitle="Missed exams"
            />
            <KPICard
              title="Total FCW"
              value={summary.total_fcw || 0}
              icon={BarChart3}
              subtitle="Failed coursework"
            />
          </DashboardGrid>

          {/* Charts */}
          <Tabs defaultValue="distribution" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Distribution
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Comparison
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-red-50/50 border-red-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-700">FEX Distribution</CardTitle>
                  <CardDescription>Failed exam distribution by {drilldown}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey={getDataKey()} 
                            angle={-45} 
                            textAnchor="end" 
                            height={100} 
                            stroke="#64748b"
                            fontSize={12}
                          />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="total_fex" fill="#ef4444" name="FEX" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="total_mex" fill="#f59e0b" name="MEX" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="total_fcw" fill="#8b5cf6" name="FCW" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                      <div className="text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No FEX data available for selected filters</p>
                        <p className="text-sm mt-2">Try adjusting your filters or check if data exists.</p>
                      </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-orange-700">FEX Trends</CardTitle>
                  <CardDescription>Trend analysis over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    Trend analysis charts - Coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-purple-50/50 border-purple-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700">Comparison Analysis</CardTitle>
                  <CardDescription>Compare FEX rates across different dimensions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    Comparison charts - Coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700">Detailed FEX Data</CardTitle>
                  <CardDescription>Complete breakdown of failed exams</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Faculty/Department</th>
                            <th className="px-4 py-2 text-right">FEX</th>
                            <th className="px-4 py-2 text-right">MEX</th>
                            <th className="px-4 py-2 text-right">FCW</th>
                            <th className="px-4 py-2 text-right">Completed</th>
                            <th className="px-4 py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.slice(0, 20).map((row, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2">{row[getDataKey()] || 'N/A'}</td>
                              <td className="px-4 py-2 text-right text-red-600 font-semibold">{row.total_fex || 0}</td>
                              <td className="px-4 py-2 text-right text-orange-600">{row.total_mex || 0}</td>
                              <td className="px-4 py-2 text-right text-purple-600">{row.total_fcw || 0}</td>
                              <td className="px-4 py-2 text-right text-green-600">{row.total_completed || 0}</td>
                              <td className="px-4 py-2 text-right font-medium">{row.total_exams || 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No data available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FEXAnalytics;
