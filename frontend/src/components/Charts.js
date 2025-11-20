/**
 * Charts Component - Modern UI with Recharts
 * Displays various analytics charts with data
 */
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

// Color themes
const DEPT_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
const PAYMENT_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const GRADE_COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff'];
const ATTENDANCE_COLORS = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'];
const STUDENT_COLORS = ['#ef4444', '#f87171', '#fca5a5', '#fecaca'];

const Charts = ({ data, filters = {}, type = 'general' }) => {
  const [chartData, setChartData] = useState({
    departments: [],
    gradesOverTime: [],
    paymentStatus: [],
    attendance: [],
    gradeDistribution: [],
    topStudents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [filters, type]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Load multiple chart data sources
      const [deptRes, gradesRes, paymentsRes] = await Promise.all([
        axios.get('/api/dashboard/students-by-department', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }).catch(() => ({ data: { departments: [], counts: [] } })),
        axios.get('/api/dashboard/grades-over-time', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }).catch(() => ({ data: { periods: [], grades: [] } })),
        axios.get('/api/dashboard/payment-status', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }).catch(() => ({ data: { statuses: [], counts: [] } }))
      ]);

      setChartData({
        departments: deptRes.data.departments?.map((dept, idx) => ({
          name: dept,
          students: deptRes.data.counts?.[idx] || 0
        })) || [],
        gradesOverTime: gradesRes.data.periods?.map((period, idx) => ({
          period,
          grade: gradesRes.data.grades?.[idx] || 0
        })) || [],
        paymentStatus: paymentsRes.data.statuses?.map((status, idx) => ({
          name: status,
          value: paymentsRes.data.counts?.[idx] || 0
        })) || [],
        attendance: [],
        gradeDistribution: [],
        topStudents: []
      });
    } catch (err) {
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Department */}
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-700">Students by Department</CardTitle>
            <CardDescription>Student distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.departments.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.departments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
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
                    <Bar dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Average Grades Over Time */}
        <Card className="bg-gradient-to-br from-white to-purple-50/50 border-purple-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-700">Average Grades Over Time</CardTitle>
            <CardDescription>Grade trends across periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.gradesOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.gradesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="period" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
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
                    <Line 
                      type="monotone" 
                      dataKey="grade" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status Distribution */}
        <Card className="bg-gradient-to-br from-white to-green-50/50 border-green-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700">Payment Status Distribution</CardTitle>
            <CardDescription>Payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.paymentStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.paymentStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.paymentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Chart Placeholder */}
        <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-orange-700">Analytics Overview</CardTitle>
            <CardDescription>Additional metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart data loading...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
