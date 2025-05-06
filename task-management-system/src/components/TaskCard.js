"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import { motion } from "framer-motion";
import Modal from "react-modal";
import toast, { Toaster } from "react-hot-toast";

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
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ created: 0, assigned: 0, overdue: 0 });

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUsers();
      fetchStats();
    }
  }, [token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5000/api/tasks?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/tasks/my-stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, dueDate, priority, assignedTo }),
    });
    if (res.ok) {
      toast.success("Task Created!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setAssignedTo("");
      fetchTasks();
      fetchStats(); // refresh dashboard counters
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/tasks/${selectedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, dueDate, priority, assignedTo }),
    });
    if (res.ok) {
      toast.success("Task Updated!");
      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    }
  };

  const handleDelete = async (taskId) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success("Task Deleted");
      fetchTasks();
      fetchStats();
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setAssignedTo(task.assignedTo);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">

        {/* Dashboard Counters */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard title="Tasks Created" count={stats.created} color="bg-green-500" />
          <StatCard title="Tasks Assigned" count={stats.assigned} color="bg-yellow-500" />
          <StatCard title="Overdue Tasks" count={stats.overdue} color="bg-red-500" />
        </motion.div>

        {/* Main Content: Left Form + Right Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Create Task Form */}
          <motion.form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Task Description"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              className="input"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Assign to...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <motion.button
              className="bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Task
            </motion.button>
          </motion.form>

          {/* Task List */}
          <motion.div
            className="lg:col-span-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search tasks..."
              className="border p-3 w-full mb-6 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={() => handleDelete(task._id)}
                  onEdit={() => openModal(task)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {selectedTask && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal">
          <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Task Title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Task Description"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              className="input"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Assign to...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full mt-2">Update Task</button>
          </form>
        </Modal>
      )}
    </>
  );
}

function StatCard({ title, count, color }) {
  return (
    <motion.div
      className={`p-6 rounded-lg text-white shadow-lg ${color}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <motion.p className="text-3xl font-bold mt-2" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
        {count}
      </motion.p>
    </motion.div>
  );
}
