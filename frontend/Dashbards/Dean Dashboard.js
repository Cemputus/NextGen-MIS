import React, { useEffect, useState } from 'react';

export default function DeanDashboard({ facultyId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/dashboard/dean/${facultyId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) throw new Error('Failed to fetch Dean dashboard');
        setData(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (facultyId) load();
  }, [facultyId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const k = data?.kpis || {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dean Dashboard</h1>
      <p className="text-sm text-gray-500">Faculty-wide performance and administration overview</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Departments</div>
          <div className="text-2xl font-semibold">{k.departments ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Faculty Students</div>
          <div className="text-2xl font-semibold">{k.students ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Research Output</div>
          <div className="text-2xl font-semibold">{k.research_papers ?? '—'}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-600">Staff Count</div>
          <div className="text-2xl font-semibold">{k.staff ?? '—'}</div>
        </div>
      </div>

      {/* Faculty Performance */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Faculty Performance Overview</h2>
        <ul className="space-y-2">
          {(data?.performance || []).map((p, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <div>
                <div className="font-medium">{p.metric}</div>
                <div className="text-xs text-gray-500">{p.description}</div>
              </div>
              <span className="text-sm text-gray-500">{p.value}</span>
            </li>
          ))}

          {!(data?.performance || []).length && (
            <li className="text-sm text-gray-500">No performance records found</li>
          )}
        </ul>
      </div>

      {/* Departments List */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Departments Under Faculty</h2>
        <ul className="space-y-2">
          {(data?.departments || []).map((d, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-gray-500">{d.hod}</div>
              </div>
              <span className="text-sm text-gray-500">{d.students} students</span>
            </li>
          ))}

          {!(data?.departments || []).length && (
            <li className="text-sm text-gray-500">No departments available</li>
          )}
        </ul>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-3">Upcoming Faculty Meetings</h2>
        <ul className="space-y-2">
          {(data?.meetings || []).map((m, i) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <div>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-gray-500">{m.date}</div>
              </div>
              <span className="text-sm">{m.status}</span>
            </li>
          ))}

          {!(data?.meetings || []).length && (
            <li className="text-sm text-gray-500">No upcoming meetings</li>
          )}
        </ul>
      </div>
    </div>
  );
}
