/**
 * Generic Analytics Page - For roles that need analytics (HOD, Dean, Senate, Analyst, HR, Finance)
 */
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import GlobalFilterPanel from '../components/GlobalFilterPanel';
import RoleBasedCharts from '../components/RoleBasedCharts';
import ModernStatsCards from '../components/ModernStatsCards';
import ExportButtons from '../components/ExportButtons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const AnalyticsPage = ({ type = 'general' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const endpoint = type === 'finance' ? '/api/analytics/finance' : '/api/dashboard/stats';
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: filters
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    const titles = {
      'hod': 'Department Analytics',
      'dean': 'Faculty Analytics',
      'senate': 'Institution Analytics',
      'analyst': 'Analytics Workspace',
      'hr': 'HR Analytics',
      'finance': 'Financial Analytics',
      'general': 'Analytics'
    };
    return titles[type] || 'Analytics';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>
        <ExportButtons stats={stats} filters={filters} filename={`${type}_analytics`} />
      </div>

      <GlobalFilterPanel onFilterChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <ModernStatsCards stats={stats} type={type} />
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Detailed analytics and visualizations</CardDescription>
            </CardHeader>
            <CardContent>
              <RoleBasedCharts filters={filters} type={type} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;






