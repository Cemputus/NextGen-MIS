/**
 * High School Analytics Page
 * Analysis of high school performance, enrollment, retention, graduation rates
 */
import React, { useState, useEffect } from 'react';
import { TrendingUp, School, Users, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import ExportButtons from '../components/ExportButtons';
import { KPICard } from '../components/ui/kpi-card';
import { DashboardGrid } from '../components/ui/dashboard-grid';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2 } from 'lucide-react';
import { loadPageState, savePageState } from '../utils/statePersistence';

const HighSchoolAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [hsData, setHsData] = useState(null);
  
  // Load persisted state
  const savedState = loadPageState('high_school_analytics', { filters: {}, tab: 'enrollment' });
  const [filters, setFilters] = useState(savedState.filters || {});
  const [activeTab, setActiveTab] = useState(savedState.tab || 'enrollment');

  useEffect(() => {
    loadHighSchoolData();
  }, [filters]);

  // Save state whenever it changes
  useEffect(() => {
    savePageState('high_school_analytics', { filters, tab: activeTab });
  }, [filters, activeTab]);

  const loadHighSchoolData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/analytics/high-school', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: filters
      });
      setHsData(response.data);
    } catch (err) {
      console.error('Error loading high school data:', err);
      setHsData({ data: [], summary: { total_high_schools: 0, total_students: 0, avg_retention_rate: 0, avg_graduation_rate: 0 } });
    } finally {
      setLoading(false);
    }
  };

  const chartData = hsData?.data || [];
  const summary = hsData?.summary || {
    total_high_schools: 0,
    total_students: 0,
    avg_retention_rate: 0,
    avg_graduation_rate: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">High School Analytics</h1>
          <p className="text-muted-foreground">Enrollment, Retention, Graduation, and Performance Analysis</p>
        </div>
        <ExportButtons 
          data={hsData?.data} 
          filters={filters} 
          filename="high_school_analytics"
          stats={summary}
          chartSelectors={[
            '.recharts-wrapper',
            '[class*="chart"]',
            '[data-chart]'
          ]}
        />
      </div>

      {/* Global Filter Panel */}
      <GlobalFilterPanel onFilterChange={setFilters} pageName="high_school_analytics" />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground">Loading high school analytics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <DashboardGrid cols={{ default: 2, sm: 2, md: 4 }}>
            <KPICard
              title="Total High Schools"
              value={summary.total_high_schools || 0}
              icon={School}
              subtitle="High schools"
            />
            <KPICard
              title="Total Students"
              value={summary.total_students || 0}
              icon={Users}
              subtitle="Students from high schools"
            />
            <KPICard
              title="Avg Retention Rate"
              value={`${summary.avg_retention_rate || 0}%`}
              icon={TrendingUp}
              subtitle="Average retention"
              changeType={summary.avg_retention_rate > 80 ? 'positive' : summary.avg_retention_rate > 60 ? 'neutral' : 'negative'}
            />
            <KPICard
              title="Avg Graduation Rate"
              value={`${summary.avg_graduation_rate || 0}%`}
              icon={GraduationCap}
              subtitle="Average graduation"
              changeType={summary.avg_graduation_rate > 80 ? 'positive' : summary.avg_graduation_rate > 60 ? 'neutral' : 'negative'}
            />
          </DashboardGrid>

          {/* Charts */}
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            savePageState('high_school_analytics', { filters, tab: value });
          }} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="enrollment" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Enrollment
              </TabsTrigger>
              <TabsTrigger value="retention" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Retention & Graduation
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="programs" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Programs
              </TabsTrigger>
              <TabsTrigger value="tuition" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tuition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enrollment" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700">Enrollment by High School</CardTitle>
                  <CardDescription>Student enrollment distribution across high schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]" data-chart-title="Enrollment by High School">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.slice(0, 20)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="high_school" 
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
                          <Bar dataKey="total_students" fill="#3182CE" name="Total Students" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="enrolled_students" fill="#38A169" name="Enrolled" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No high school data available</p>
                          <p className="text-sm mt-2">Try adjusting your filters</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="retention" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-green-50/50 border-green-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-700">Retention & Graduation Rates</CardTitle>
                  <CardDescription>Retention, graduation, and dropout rates by high school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]" data-chart-title="Retention & Graduation Rates">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.slice(0, 20)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="high_school" 
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
                          <Line type="monotone" dataKey="retention_rate" stroke="#38A169" name="Retention Rate %" strokeWidth={2} />
                          <Line type="monotone" dataKey="graduation_rate" stroke="#3182CE" name="Graduation Rate %" strokeWidth={2} />
                          <Line type="monotone" dataKey="dropout_rate" stroke="#E53E3E" name="Dropout Rate %" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p>No retention data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-purple-50/50 border-purple-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700">Performance Analysis</CardTitle>
                  <CardDescription>Academic performance metrics by high school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Performance analysis charts</p>
                      <p className="text-sm mt-2">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="programs" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-orange-700">Program Distribution</CardTitle>
                  <CardDescription>Program distribution by high school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Program distribution charts</p>
                      <p className="text-sm mt-2">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tuition" className="space-y-4">
              <Card className="bg-gradient-to-br from-white to-yellow-50/50 border-yellow-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-yellow-700">Tuition Completion Rates</CardTitle>
                  <CardDescription>Tuition completion rates by high school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Tuition completion analysis</p>
                      <p className="text-sm mt-2">Coming soon</p>
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

export default HighSchoolAnalytics;
