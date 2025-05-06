import { useState, useEffect } from 'react';
import { getUsers } from '../utils/api';

export default function TaskList({ tasks, onEdit, onDelete, onAssign }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    getUsers().then((response) => setUsers(response.data)).catch(() => setUsers([]));
  }, []);

  const handleAssign = (taskId) => {
    if (selectedUser[taskId]) {
      onAssign(taskId, selectedUser[taskId]);
      setSelectedUser((prev) => ({ ...prev, [taskId]: '' }));
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="p-4 border rounded shadow-sm bg-white">
          <h3 className="text-lg font-bold">{task.title}</h3>
          <p>{task.description}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.status}</p>
          <p>Assigned To: {task.assignedTo?.name || 'Unassigned'}</p>
          <div className="mt-2 flex items-center space-x-2">
            <select
              value={selectedUser[task._id] || ''}
              onChange={(e) =>
                setSelectedUser((prev) => ({ ...prev, [task._id]: e.target.value }))
              }
              className="p-2 border rounded"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleAssign(task._id)}
              className="bg-green-500 text-white p-2 rounded"
            >
              Assign
            </button>
          </div>
          <div className="mt-2">
            <button
              onClick={() => onEdit(task)}
              className="mr-2 bg-yellow-500 text-white p-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}