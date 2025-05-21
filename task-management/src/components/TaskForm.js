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
    
    // Only reset if we're creating a new task (not editing)
    if (!task) {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setStatus('Pending');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{task ? 'Edit Task' : 'Create New Task'}</h2>
      
      <div className="space-y-6">
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
            placeholder="Task description"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <div className="flex space-x-4">
            {['Pending', 'In Progress', 'Completed'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
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
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {task ? 'Update Task' : 'Create Task'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Add reset button for better UX */}
          {!task && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200"
            >
              Reset Form
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}