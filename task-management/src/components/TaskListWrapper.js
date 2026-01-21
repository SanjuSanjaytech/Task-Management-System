// components/TaskListWrapper.js
import TaskList from './TaskList';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function TaskListWrapper({ tasks, loading, onEdit, onDelete, onAssign, onAddNew, currentFilter }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="text-center py-10">
        <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <h3 className="text-sm font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {currentFilter === 'all'
            ? 'Create your first task to get started.'
            : `No ${currentFilter} tasks match your filters.`}
        </p>
        <button
          onClick={onAddNew}
          className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" /> New Task
        </button>
      </div>
    );
  }

  return (
    <TaskList tasks={tasks} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} />
  );
}
