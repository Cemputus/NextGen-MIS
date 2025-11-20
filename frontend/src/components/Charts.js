/**
 * Charts Component - Fully Dynamic with Filters
 * Displays various analytics charts with filter-based data
 */
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
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
    topStudents: [],
    enrollmentTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [filters, type]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Load all chart data sources with filters
      const [deptRes, gradesRes, paymentsRes, gradeDistRes, topStudentsRes, attendanceRes] = await Promise.all([
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
        }).catch(() => ({ data: { statuses: [], counts: [] } })),
        axios.get('/api/dashboard/grade-distribution', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }).catch(() => ({ data: { grades: [], counts: [] } })),
        axios.get('/api/dashboard/top-students', {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...filters, limit: 10 }
        }).catch(() => ({ data: { students: [], grades: [] } })),
        axios.get('/api/dashboard/attendance-trends', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }).catch(() => ({ data: { periods: [], attendance: [] } }))
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
        gradeDistribution: gradeDistRes.data.grades?.map((grade, idx) => ({
          name: grade,
          value: gradeDistRes.data.counts?.[idx] || 0
        })) || [],
        topStudents: topStudentsRes.data.students?.slice(0, 10).map((student, idx) => ({
          name: student.length > 15 ? student.substring(0, 15) + '...' : student,
          grade: topStudentsRes.data.grades?.[idx] || 0
        })) || [],
        attendance: attendanceRes.data.periods?.map((period, idx) => ({
          period,
          attendance: attendanceRes.data.attendance?.[idx] || 0
        })) || []
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
            <CardDescription>Student distribution across departments {Object.keys(filters).length > 0 && '(Filtered)'}</CardDescription>
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
                  No data available for selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Average Grades Over Time */}
        <Card className="bg-gradient-to-br from-white to-purple-50/50 border-purple-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-700">Average Grades Over Time</CardTitle>
            <CardDescription>Grade trends across periods {Object.keys(filters).length > 0 && '(Filtered)'}</CardDescription>
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
                  No data available for selected filters
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
            <CardDescription>Payment status breakdown {Object.keys(filters).length > 0 && '(Filtered)'}</CardDescription>
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
                  No data available for selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-orange-700">Grade Distribution</CardTitle>
            <CardDescription>Distribution of letter grades {Object.keys(filters).length > 0 && '(Filtered)'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.gradeDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartData.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
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
                  No data available for selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card className="bg-gradient-to-br from-white to-red-50/50 border-red-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-700">Top 10 Students</CardTitle>
            <CardDescription>Highest performing students {Object.keys(filters).length > 0 && '(Filtered)'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.topStudents.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.topStudents}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
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
                    <Bar dataKey="grade" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available for selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Trends */}
        <Card className="bg-gradient-to-br from-white to-yellow-50/50 border-yellow-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-700">Attendance Trends</CardTitle>
            <CardDescription>Attendance over time {Object.keys(filters).length > 0 && '(Filtered)'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.attendance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.attendance}>
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
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#f59e0b" 
                      fill="#fbbf24"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available for selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
