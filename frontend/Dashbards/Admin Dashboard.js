import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ adminId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/dashboard/admin/${adminId || ''}`, {
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!res.ok) throw new Error('Failed to fetch admin dashboard');
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [adminId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const k = data?.kpis || {};

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">System health, user management and quick actions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-3 py-1 rounded bg-green-600 text-white">Run Health Check</button>
          <button className="px-3 py-1 rounded border">Settings</button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-semibold">{k.total_users ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Active Sessions</div>
          <div className="text-2xl font-semibold">{k.active_sessions ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Open Tickets</div>
          <div className="text-2xl font-semibold">{k.open_tickets ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Pending Approvals</div>
          <div className="text-2xl font-semibold">{k.pending_approvals ?? '—'}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">System Uptime</div>
          <div className="text-2xl font-semibold">{k.uptime ?? '—'}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm">Create User</button>
            <button className="px-3 py-2 rounded bg-amber-500 text-white text-sm">Send Broadcast</button>
            <button className="px-3 py-2 rounded border text-sm">Reindex Search</button>
            <button className="px-3 py-2 rounded border text-sm">Run Backup</button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Pending Approvals</h2>
          <ul className="space-y-2">
            {(data?.pending || []).slice(0, 8).map((p, i) => (
              <li key={i} className="flex items-start justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.sub || p.date}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 rounded bg-green-600 text-white text-sm">Approve</button>
                  <button className="px-2 py-1 rounded border text-sm">Reject</button>
                </div>
              </li>
            ))}
            {(!data?.pending || data.pending.length === 0) && <li className="text-sm text-gray-500">No pending items</li>}
          </ul>
        </div>
      </section>

      <section className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">System Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">DB Connections</div>
            <div className="text-lg font-semibold">{k.db_connections ?? '—'}</div>
            <div className="text-xs text-gray-500">{k.db_status ?? ''}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">CPU Load</div>
            <div className="text-lg font-semibold">{k.cpu_load ?? '—'}</div>
            <div className="text-xs text-gray-500">{k.cpu_status ?? ''}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Memory Usage</div>
            <div className="text-lg font-semibold">{k.memory ?? '—'}</div>
            <div className="text-xs text-gray-500">{k.memory_status ?? ''}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
