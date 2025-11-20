/**
 * Role-Based Charts Component
 * Displays charts tailored to each user role with UCU branding
 * - Students: Own performance, payments, attendance
 * - Staff: Their courses/classes over time
 * - HOD: Department-level analytics
 * - Dean: Faculty-level analytics
 * - Senate: Institution-wide analytics
 * - Finance: Payment trends only (no academic data)
 */
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// UCU Branding Colors
const UCU_COLORS = {
  blue: '#003366',      // UCU Primary Blue
  'blue-light': '#004080',
  'blue-dark': '#002244',
  gold: '#FFD700',      // UCU Gold
  'gold-light': '#FFE44D',
  'gold-dark': '#CCAA00',
  navy: '#1a237e',
};

// Chart color palettes
const DEPT_COLORS = [UCU_COLORS.blue, '#004080', '#0059b3', '#0073e6'];
const PAYMENT_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#ef4444'];
const GRADE_COLORS = [UCU_COLORS.gold, '#FFE44D', '#FFD700', '#CCAA00', '#f59e0b'];
const ATTENDANCE_COLORS = [UCU_COLORS.blue, '#004080', '#0059b3'];

const RoleBasedCharts = ({ filters = {}, type = 'general' }) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState({
    studentDistribution: [],
    gradesOverTime: [],
    paymentStatus: [],
    attendance: [],
    gradeDistribution: [],
    topStudents: [],
    paymentTrends: [],
    studentPaymentBreakdown: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [JSON.stringify(filters), type, user?.role]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const role = user?.role || 'student';
      
      // Role-specific data loading
      const requests = [];
      
      // Student Distribution by Department (for Senate, Dean, HOD, Staff)
      if (['senate', 'dean', 'hod', 'staff', 'analyst'].includes(role)) {
        requests.push(
          axios.get('/api/dashboard/students-by-department', {
            headers: { Authorization: `Bearer ${token}` },
            params: filters
          }).catch(() => ({ data: { departments: [], counts: [] } }))
        );
      }
      
      // Grades Over Time (role-specific scope)
      if (role !== 'finance') {
        requests.push(
          axios.get('/api/dashboard/grades-over-time', {
            headers: { Authorization: `Bearer ${token}` },
            params: { ...filters, role }
          }).catch(() => ({ data: { periods: [], grades: [] } }))
        );
      }
      
      // Payment Status (for Dean, HOD, Student, Finance)
      if (['dean', 'hod', 'student', 'finance', 'senate'].includes(role)) {
        requests.push(
          axios.get('/api/dashboard/payment-status', {
            headers: { Authorization: `Bearer ${token}` },
            params: { ...filters, role }
          }).catch(() => ({ data: { statuses: [], counts: [] } }))
        );
      }
      
      // Grade Distribution (NOT for finance)
      if (role !== 'finance') {
        requests.push(
          axios.get('/api/dashboard/grade-distribution', {
            headers: { Authorization: `Bearer ${token}` },
            params: filters
          }).catch(() => ({ data: { grades: [], counts: [] } }))
        );
      }
      
      // Top Students (role-specific scope)
      if (['senate', 'dean', 'hod', 'staff'].includes(role)) {
        requests.push(
          axios.get('/api/dashboard/top-students', {
            headers: { Authorization: `Bearer ${token}` },
            params: { ...filters, limit: 10, role }
          }).catch(() => ({ data: { students: [], grades: [] } }))
        );
      }
      
      // Attendance Trends (NOT for finance, but finance gets payment trends)
      if (role === 'finance') {
        requests.push(
          axios.get('/api/dashboard/payment-trends', {
            headers: { Authorization: `Bearer ${token}` },
            params: filters
          }).catch(() => ({ data: { periods: [], amounts: [] } }))
        );
      } else if (role !== 'finance') {
        requests.push(
          axios.get('/api/dashboard/attendance-trends', {
            headers: { Authorization: `Bearer ${token}` },
            params: { ...filters, role }
          }).catch(() => ({ data: { periods: [], attendance: [] } }))
        );
      }
      
      // Student Payment Breakdown (for students only)
      if (role === 'student') {
        requests.push(
          axios.get('/api/dashboard/student-payment-breakdown', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: null }))
        );
      }
      
      const results = await Promise.all(requests);
      let resultIndex = 0;
      
      const data = {};
      
      // Process Student Distribution
      if (['senate', 'dean', 'hod', 'staff', 'analyst'].includes(role)) {
        const deptRes = results[resultIndex++];
        data.studentDistribution = deptRes.data.departments?.map((dept, idx) => ({
          name: dept,
          students: deptRes.data.counts?.[idx] || 0
        })) || [];
      }
      
      // Process Grades Over Time
      if (role !== 'finance') {
        const gradesRes = results[resultIndex++];
        data.gradesOverTime = gradesRes.data.periods?.map((period, idx) => ({
          period,
          grade: gradesRes.data.grades?.[idx] || 0
        })) || [];
      }
      
      // Process Payment Status
      if (['dean', 'hod', 'student', 'finance', 'senate'].includes(role)) {
        const paymentsRes = results[resultIndex++];
        data.paymentStatus = paymentsRes.data.statuses?.map((status, idx) => ({
          name: status,
          value: paymentsRes.data.counts?.[idx] || 0
        })) || [];
      }
      
      // Process Grade Distribution
      if (role !== 'finance') {
        const gradeDistRes = results[resultIndex++];
        data.gradeDistribution = gradeDistRes.data.grades?.map((grade, idx) => ({
          name: grade,
          value: gradeDistRes.data.counts?.[idx] || 0
        })) || [];
      }
      
      // Process Top Students
      if (['senate', 'dean', 'hod', 'staff'].includes(role)) {
        const topStudentsRes = results[resultIndex++];
        data.topStudents = topStudentsRes.data.students?.slice(0, 10).map((student, idx) => ({
          name: student.length > 15 ? student.substring(0, 15) + '...' : student,
          grade: topStudentsRes.data.grades?.[idx] || 0
        })) || [];
      }
      
      // Process Attendance/Payment Trends
      if (role === 'finance') {
        const trendsRes = results[resultIndex++];
        data.paymentTrends = trendsRes.data.periods?.map((period, idx) => ({
          period,
          amount: trendsRes.data.amounts?.[idx] || 0
        })) || [];
      } else if (role !== 'finance') {
        const attendanceRes = results[resultIndex++];
        data.attendance = attendanceRes.data.periods?.map((period, idx) => ({
          period,
          attendance: attendanceRes.data.attendance?.[idx] || 0
        })) || [];
      }
      
      // Process Student Payment Breakdown
      if (role === 'student') {
        const paymentBreakdownRes = results[resultIndex++];
        data.studentPaymentBreakdown = paymentBreakdownRes.data;
      }
      
      setChartData(data);
    } catch (err) {
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: UCU_COLORS.blue }} />
      </div>
    );
  }

  const role = user?.role || 'student';

  return (
    <div className="space-y-6">
      {/* Student Distribution by Department - Senate, Dean, HOD, Staff, Analyst */}
      {['senate', 'dean', 'hod', 'staff', 'analyst'].includes(role) && (
        <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-200/50 shadow-lg" style={{ borderLeftColor: UCU_COLORS.blue, borderLeftWidth: '4px' }}>
          <CardHeader>
            <CardTitle style={{ color: UCU_COLORS.blue }}>Student Distribution by Department</CardTitle>
            <CardDescription>
              {role === 'senate' && 'Institution-wide student distribution'}
              {role === 'dean' && 'Student distribution in your faculty/school'}
              {role === 'hod' && 'Student distribution in your department'}
              {role === 'staff' && 'Student distribution in your classes'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {chartData.studentDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.studentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100} 
                      stroke={UCU_COLORS.blue}
                      fontSize={11}
                      label={{ value: 'Department', position: 'insideBottom', offset: -5, style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      stroke={UCU_COLORS.blue}
                      fontSize={11}
                      label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: `2px solid ${UCU_COLORS.blue}`,
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }} 
                      formatter={(value) => [`${value} students`, 'Count']}
                    />
                    <Bar dataKey="students" fill={UCU_COLORS.blue} radius={[8, 8, 0, 0]} />
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Grades Over Time - Role-specific */}
        {role !== 'finance' && (
          <Card className="bg-gradient-to-br from-white to-purple-50/50 border-purple-200/50 shadow-lg" style={{ borderLeftColor: UCU_COLORS.gold, borderLeftWidth: '4px' }}>
            <CardHeader>
              <CardTitle style={{ color: UCU_COLORS.navy }}>Average Grades Over Time</CardTitle>
              <CardDescription>
                {role === 'staff' && 'Your courses performance over time'}
                {role === 'hod' && 'Your department performance over time'}
                {role === 'dean' && 'Your faculty/school performance over time'}
                {role === 'senate' && 'Institution-wide performance over time'}
                {role === 'student' && 'Your academic performance over time'}
              </CardDescription>
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
                        stroke={UCU_COLORS.blue}
                        fontSize={11}
                        label={{ value: 'Time Period', position: 'insideBottom', offset: -5, style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                      />
                      <YAxis 
                        stroke={UCU_COLORS.blue}
                        fontSize={11}
                        label={{ value: 'Average Grade (%)', angle: -90, position: 'insideLeft', style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: `2px solid ${UCU_COLORS.blue}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value.toFixed(2)}%`, 'Average Grade']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="grade" 
                        stroke={UCU_COLORS.gold} 
                        strokeWidth={3}
                        dot={{ fill: UCU_COLORS.gold, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Average Grade"
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
        )}

        {/* Payment Status Distribution - Role-specific */}
        {['dean', 'hod', 'student', 'finance', 'senate'].includes(role) && (
          <Card className="bg-gradient-to-br from-white to-green-50/50 border-green-200/50 shadow-lg" style={{ borderLeftColor: '#10b981', borderLeftWidth: '4px' }}>
            <CardHeader>
              <CardTitle style={{ color: '#10b981' }}>
                {role === 'student' ? 'My Payment Status' : 'Payment Status Distribution'}
              </CardTitle>
              <CardDescription>
                {role === 'dean' && 'Payment status in your faculty/school'}
                {role === 'hod' && 'Payment status in your department'}
                {role === 'student' && 'Your payment breakdown with amounts and percentages'}
                {role === 'finance' && 'Overall payment status distribution'}
                {role === 'senate' && 'Institution-wide payment status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.paymentStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {role === 'student' && chartData.studentPaymentBreakdown ? (
                      // Student-specific payment breakdown with amounts
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg border-2" style={{ borderColor: UCU_COLORS.blue }}>
                            <div className="text-sm font-medium text-gray-600">Total Paid</div>
                            <div className="text-2xl font-bold" style={{ color: UCU_COLORS.blue }}>
                              UGX {((chartData.studentPaymentBreakdown.total_paid || 0) / 1000000).toFixed(2)}M
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {chartData.studentPaymentBreakdown.paid_percentage?.toFixed(1) || 0}% of total
                            </div>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                            <div className="text-sm font-medium text-gray-600">Outstanding</div>
                            <div className="text-2xl font-bold text-orange-600">
                              UGX {((chartData.studentPaymentBreakdown.total_pending || 0) / 1000000).toFixed(2)}M
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {chartData.studentPaymentBreakdown.pending_percentage?.toFixed(1) || 0}% remaining
                            </div>
                          </div>
                        </div>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Paid', value: chartData.studentPaymentBreakdown.total_paid || 0 },
                              { name: 'Pending', value: chartData.studentPaymentBreakdown.total_pending || 0 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill={UCU_COLORS.blue} />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip 
                            formatter={(value) => `UGX ${(value / 1000000).toFixed(2)}M`}
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: `2px solid ${UCU_COLORS.blue}`,
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </div>
                    ) : (
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
                            border: `2px solid ${UCU_COLORS.blue}`,
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value) => [`${value} students`, 'Count']}
                        />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No payment data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution - NOT for Finance */}
        {role !== 'finance' && (
          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200/50 shadow-lg" style={{ borderLeftColor: UCU_COLORS.gold, borderLeftWidth: '4px' }}>
            <CardHeader>
              <CardTitle style={{ color: UCU_COLORS.navy }}>Grade Distribution</CardTitle>
              <CardDescription>Distribution of letter grades</CardDescription>
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
                          border: `2px solid ${UCU_COLORS.blue}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value} students`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No grade data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 10 Students - Role-specific scope */}
        {['senate', 'dean', 'hod', 'staff'].includes(role) && (
          <Card className="bg-gradient-to-br from-white to-red-50/50 border-red-200/50 shadow-lg" style={{ borderLeftColor: UCU_COLORS.gold, borderLeftWidth: '4px' }}>
            <CardHeader>
              <CardTitle style={{ color: UCU_COLORS.navy }}>Top 10 Students</CardTitle>
              <CardDescription>
                {role === 'senate' && 'Overall top 10 students across institution'}
                {role === 'dean' && 'Top 10 students in your faculty/school'}
                {role === 'hod' && 'Top 10 students in your department'}
                {role === 'staff' && 'Top 10 students in your program/class'}
              </CardDescription>
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
                        stroke={UCU_COLORS.blue}
                        fontSize={11}
                        label={{ value: 'Student Name', position: 'insideBottom', offset: -5, style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                      />
                      <YAxis 
                        stroke={UCU_COLORS.blue}
                        fontSize={11}
                        label={{ value: 'Average Grade (%)', angle: -90, position: 'insideLeft', style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: `2px solid ${UCU_COLORS.blue}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`${value.toFixed(2)}%`, 'Average Grade']}
                      />
                      <Bar dataKey="grade" fill={UCU_COLORS.gold} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No student data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Trends - Finance only */}
        {role === 'finance' && (
          <Card className="bg-gradient-to-br from-white to-green-50/50 border-green-200/50 shadow-lg" style={{ borderLeftColor: '#10b981', borderLeftWidth: '4px' }}>
            <CardHeader>
              <CardTitle style={{ color: '#10b981' }}>Payment Trends Over Time</CardTitle>
              <CardDescription>Payment collection trends and revenue flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartData.paymentTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.paymentTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="period" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80} 
                        stroke={UCU_COLORS.blue}
                        fontSize={11}
                        label={{ value: 'Time Period', position: 'insideBottom', offset: -5, style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                      />
                      <YAxis 
                        stroke={UCU_COLORS.blue}
                        fontSize={11}
                        label={{ value: 'Amount (UGX)', angle: -90, position: 'insideLeft', style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: `2px solid ${UCU_COLORS.blue}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value) => [`UGX ${(value / 1000000).toFixed(2)}M`, 'Amount']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#10b981" 
                        fill="#34d399"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No payment trend data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendance Trends - NOT for Finance */}
      {role !== 'finance' && (
        <Card className="bg-gradient-to-br from-white to-yellow-50/50 border-yellow-200/50 shadow-lg" style={{ borderLeftColor: UCU_COLORS.gold, borderLeftWidth: '4px' }}>
          <CardHeader>
            <CardTitle style={{ color: UCU_COLORS.navy }}>Attendance Trends</CardTitle>
            <CardDescription>
              {role === 'staff' && 'Attendance in your courses over time'}
              {role === 'hod' && 'Attendance in your department over time'}
              {role === 'dean' && 'Attendance in your faculty/school over time'}
              {role === 'senate' && 'Institution-wide attendance trends'}
              {role === 'student' && 'Your attendance over time'}
            </CardDescription>
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
                      stroke={UCU_COLORS.blue}
                      fontSize={11}
                      label={{ value: 'Time Period', position: 'insideBottom', offset: -5, style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      stroke={UCU_COLORS.blue}
                      fontSize={11}
                      label={{ value: 'Average Attendance (Hours)', angle: -90, position: 'insideLeft', style: { fill: UCU_COLORS.blue, fontWeight: 'bold' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: `2px solid ${UCU_COLORS.blue}`,
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`${value.toFixed(2)} hours`, 'Attendance']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke={UCU_COLORS.gold} 
                      fill="#FFE44D"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No attendance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleBasedCharts;


