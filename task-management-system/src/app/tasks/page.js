"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTaskId) {
        // Edit task
        await axios.put(`http://localhost:5000/api/tasks/${editingTaskId}`, form, {
          withCredentials: true,
        });
        setEditingTaskId(null);
      } else {
        // Create task
        await axios.post("http://localhost:5000/api/tasks", form, {
          withCredentials: true,
        });
      }

      fetchTasks();
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        assignedTo: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
      priority: task.priority,
      assignedTo: task.assignedTo,
    });
    setEditingTaskId(task._id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{editingTaskId ? "Edit Task" : "Create Task"}</h2>

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Assign To</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editingTaskId ? "Update Task" : "Create Task"}
        </button>
      </form>

      {/* Task List */}
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold">{t.title}</h3>
            <p>{t.description}</p>
            <p>Due: {new Date(t.dueDate).toLocaleDateString()}</p>
            <p>Priority: {t.priority}</p>
            <p>Status: {t.status}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(t)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
