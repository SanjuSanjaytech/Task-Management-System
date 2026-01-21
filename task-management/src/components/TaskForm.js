import { useState, useEffect } from 'react';
import { getUsers } from '../utils/api';
import { toast } from 'react-toastify';

export default function TaskForm({ task, onSubmit, loading }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [status, setStatus] = useState(task?.status || 'Pending');
  const [users, setUsers] = useState([]);

  // 🤖 AI state
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    getUsers()
      .then((response) => setUsers(response.data))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert dueDate string (YYYY-MM-DD) to JS Date for backend
    const dueDateObj = dueDate ? new Date(dueDate) : null;

    onSubmit({
      title,
      description,
      dueDate: dueDateObj,
      priority,
      status,
    });

    if (!task) resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setStatus('Pending');
    setAiText('');
  };

  // 🤖 AI Fill Function
  const handleAIFill = async () => {
    if (!aiText.trim()) {
      toast.error("Please describe your task");
      return;
    }

    try {
      setAiLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/tasks/ai-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: aiText })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "AI failed");
      }

      // Convert AI dueDate to YYYY-MM-DD for input
      const aiDueDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '';

      // Autofill fields
      setTitle(data.title || '');
      setDescription(data.description || '');
      setDueDate(aiDueDate);
      setPriority(data.priority || 'Medium');

      toast.success("AI filled the form 🤖");

    } catch (err) {
      toast.error(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>

      {/* 🤖 AI Smart Input */}
      {!task && (
        <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-indigo-700 mb-2">
            🤖 Create using AI
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder="e.g. Finish backend by tomorrow high priority"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAIFill}
              disabled={aiLoading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              {aiLoading ? "Thinking..." : "Fill with AI"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <div className="flex space-x-4">
            {['Pending', 'In Progress', 'Completed'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={status === option}
                  onChange={() => setStatus(option)}
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
            ) : (
              task ? 'Update Task' : 'Create Task'
            )}
          </button>

          {!task && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg"
            >
              Reset Form
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
