import { useState } from 'react';
import TaskForm from './TaskForm';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function TaskFormWrapper({ editingTask, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (taskData) => {
    setLoading(true);                // start spinner
    await onSubmit(taskData);        // call parent handler
    setLoading(false);               // stop spinner
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <TaskForm 
        task={editingTask} 
        onSubmit={handleSubmit} 
        onCancel={onCancel} 
        loading={loading}               // pass loading prop
      />
    </div>
  );
}
