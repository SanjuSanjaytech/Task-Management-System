"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ assigned: 0, created: 0, overdue: 0 });

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/tasks/my-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Tasks Assigned To You" count={stats.assigned} />
          <StatCard title="Tasks You Created" count={stats.created} />
          <StatCard title="Overdue Tasks" count={stats.overdue} />
        </div>
      </div>
    </>
  );
}

function StatCard({ title, count }) {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-2xl font-bold text-blue-600">{count}</p>
    </div>
  );
}
