"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";

export default function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [token]);

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5000/api/tasks?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, dueDate, priority, assignedTo }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setAssignedTo("");
      fetchTasks();
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>

        {/* Create Task Form */}
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Task</h2>
          <input
            type="text"
            placeholder="Title"
            className="border p-2 w-full mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-2 w-full mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="date"
            className="border p-2 w-full mb-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <select
            className="border p-2 w-full mb-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            className="border p-2 w-full mb-2"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            <option value="">Assign to...</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Create Task</button>
        </form>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border p-2 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTasks()}
          />
        </div>

        {/* List */}
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </>
  );
}
