import { useState, useEffect } from 'react';
import { getUsers } from '../utils/api';

export default function TaskForm({ task, onSubmit }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate?.split('T')[0] || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [status, setStatus] = useState(task?.status || 'Pending');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((response) => setUsers(response.data)).catch(() => setUsers([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate, priority, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-6 rounded shadow-md">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {task ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}