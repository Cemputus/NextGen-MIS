import React, { useEffect, useState } from 'react';

export default function HODDashboard({ departmentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/dashboard/hod/${departmentId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) throw new Error('Failed to fetch HOD dashboard');
        setData(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (departmentId) load();
  }, [departmentId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const k = data?.kpis || {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">HOD Dashboard</h1>
      <p className="text-sm text-gray-500">Department-level academic and administrative overview</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="text-2xl font-semibold">{k.students ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Average GPA</div>
          <div className="text-2xl font-semibold">{k.avg_gpa ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">On Probation</div>
          <div className="text-2xl font-semibold">{k.on_probation ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Graduation Rate</div>
          <div className="text-2xl font-semibold">{k.grad_rate ?? '—'}%</div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Top Performing Courses</h2>
        <ol className="list-decimal pl-6 space-y-1">
          {(data?.top_courses || []).map((c, i) => (
            <li key={i} className="flex justify-between py-1 border-b">
              {c.name}
              <span className="text-sm text-gray-500">{c.avg}</span>
            </li>
          ))}

          {!(data?.top_courses || []).length && (
            <li className="text-sm text-gray-500">No course data available</li>
          )}
        </ol>
      </div>

      {/* Staff Overview */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Academic Staff</h2>
        <ul className="space-y-2">
          {(data?.staff || []).map((s, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-500">{s.role}</div>
              </div>
              <span className="text-sm text-gray-500">{s.load} hrs/week</span>
            </li>
          ))}

          {!(data?.staff || []).length && (
            <li className="text-sm text-gray-500">No staff assigned</li>
          )}
        </ul>
      </div>
    </div>
  );
}
