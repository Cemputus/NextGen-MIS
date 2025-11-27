import React, { useEffect, useState } from 'react';

export default function FinanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/dashboard/finance`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) throw new Error('Failed to fetch Finance dashboard');
        setData(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const k = data?.kpis || {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Finance Dashboard</h1>
      <p className="text-sm text-gray-500">Institutional financial overview and revenue tracking</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-2xl font-semibold">UGX {k.total_revenue?.toLocaleString() ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Outstanding Balances</div>
          <div className="text-2xl font-semibold">UGX {k.outstanding?.toLocaleString() ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Paid Students</div>
          <div className="text-2xl font-semibold">{k.paid_students ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Pending Payments</div>
          <div className="text-2xl font-semibold">{k.pending ?? '—'}</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Revenue Breakdown</h2>
        <ul className="space-y-2">
          {(data?.breakdown || []).map((b, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <div>
                <div className="font-medium">{b.category}</div>
                <div className="text-xs text-gray-500">{b.description}</div>
              </div>
              <span className="text-sm">UGX {b.amount.toLocaleString()}</span>
            </li>
          ))}

          {!(data?.breakdown || []).length && (
            <li className="text-sm text-gray-500">No financial categories found</li>
          )}
        </ul>
      </div>

      {/* Payment Logs */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Recent Payment Logs</h2>
        <ul className="space-y-2">
          {(data?.logs || []).map((log, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <div>
                <div className="font-medium">{log.student}</div>
                <div className="text-xs text-gray-500">{log.date}</div>
              </div>
              <span className="text-sm">UGX {log.amount.toLocaleString()}</span>
            </li>
          ))}

          {!(data?.logs || []).length && (
            <li className="text-sm text-gray-500">No recent logs available</li>
          )}
        </ul>
      </div>

      {/* Financial Trends */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Financial Trends</h2>
        <svg width="100%" height="150">
          <polyline
            fill="none"
            stroke="black"
            strokeWidth="2"
            points={data?.trend?.join(' ') || ''}
          />
        </svg>
      </div>
    </div>
  );
}
