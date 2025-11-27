import { useEffect, useState } from "react";

export default function StaffDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/dashboard/staff/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load staff dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.kpis?.map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">{kpi.label}</p>
            <p className="text-2xl font-semibold">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-3">Recent Logs</h2>
        <ul className="space-y-2">
          {data?.recent?.map((item, i) => (
            <li key={i} className="border-b pb-2">
              <p className="font-medium">{item.action}</p>
              <p className="text-gray-600 text-sm">{item.date}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-3">Staff Activity Trend</h2>
        <svg width="100%" height="140">
          <polyline
            fill="none"
            stroke="black"
            strokeWidth="2"
            points={data?.trend?.join(" ")}
          />
        </svg>
      </div>
    </div>
  );
}
