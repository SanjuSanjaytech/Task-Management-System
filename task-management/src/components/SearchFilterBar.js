import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function SearchFilterBar({ onSearch, className }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: searchTerm, priority, dueDate });
  };

  const handleReset = () => {
    setSearchTerm('');
    setPriority('');
    setDueDate('');
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button type="submit" className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <FunnelIcon className="h-4 w-4 mr-2" /> Apply Filters
          </button>
          <button type="button" onClick={handleReset} className="inline-flex justify-center items-center px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50">
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
