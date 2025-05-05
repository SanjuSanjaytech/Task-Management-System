"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const myAssignedTasks = tasks.filter((t) => t.assignedTo === user?.id);
  const myCreatedTasks = tasks.filter((t) => t.createdBy === user?.id);
  const overdueTasks = tasks.filter((t) => t.dueDate.slice(0, 10) < today && t.status !== "done");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Overdue Tasks */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-red-600 mb-2">Overdue Tasks</h3>
        {overdueTasks.length === 0 ? (
          <p>No overdue tasks! 🎉</p>
        ) : (
          overdueTasks.map((t) => (
            <div key={t._id} className="border p-2 rounded bg-red-100 mb-2">
              {t.title} (Due: {new Date(t.dueDate).toLocaleDateString()})
            </div>
          ))
        )}
      </div>

      {/* My Assigned Tasks */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Tasks Assigned to Me</h3>
        {myAssignedTasks.map((t) => (
          <div key={t._id} className="border p-2 rounded bg-green-100 mb-2">
            {t.title}
          </div>
        ))}
      </div>

      {/* My Created Tasks */}
      <div>
        <h3 className="text-xl font-semibold">Tasks I Created</h3>
        {myCreatedTasks.map((t) => (
          <div key={t._id} className="border p-2 rounded bg-blue-100 mb-2">
            {t.title}
          </div>
        ))}
      </div>
    </div>
  );
}
