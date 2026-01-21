import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import SearchFilterBar from '../components/SearchFilterBar';
import StatusTabs from '../components/StatusTabs';
import TaskFormWrapper from '../components/TaskFormWrapper';
import TaskListWrapper from '../components/TaskListWrapper';
import { fetchTasks, createTask, updateTask, deleteTask, assignTask } from '../redux/slices/taskSlice';
import { addTaskToStore, updateTaskInStore } from '../redux/slices/taskSlice';
import { toast } from 'react-toastify';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function Tasks() {
  const [editingTask, setEditingTask] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const handleSearch = (filters) => {
    dispatch(fetchTasks({ ...filters, status: currentFilter === 'all' ? undefined : currentFilter }));
  };

 
const handleCreateOrUpdate = async (taskData) => {
  try {
    if (editingTask) {
      // Update existing task
      const updatedTask = await dispatch(
        updateTask({ id: editingTask._id, task: taskData })
      ).unwrap(); // throws if error

      // Update local store
      dispatch(updateTaskInStore(updatedTask));
      toast.success("Task updated successfully");
    } else {
      // Create new task
      const newTask = await dispatch(createTask(taskData)).unwrap();

      // Add to store
      dispatch(addTaskToStore(newTask));
      toast.success("Task created successfully");
    }

    setEditingTask(null);
    setActiveTab("list");
  } catch (error) {
    console.error(error); // helpful for debugging
    if (error.message === "Invalid token") {
      toast.error("Session expired. Please login again.");
      // Optionally: redirect to login
    } else {
      toast.error(error.message || "Failed to save task");
    }
  }
};



  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success('Task deleted successfully');
      dispatch(fetchTasks({ status: currentFilter === 'all' ? undefined : currentFilter }));
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleAssign = async (taskId, userId) => {
    try {
      await dispatch(assignTask({ taskId, userId })).unwrap();
      toast.success('Task assigned successfully');
      dispatch(fetchTasks({ status: currentFilter === 'all' ? undefined : currentFilter }));
    } catch (error) {
      toast.error(error.message || 'Failed to assign task');
    }
  };

  const handleFilter = (status) => {
    setCurrentFilter(status);
    dispatch(fetchTasks({ status: status === 'all' ? undefined : status }));
  };

  useEffect(() => { dispatch(fetchTasks()); }, [dispatch]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Efficiently organize and track your tasks</p>
          </div>

          <SearchFilterBar onSearch={handleSearch} className="mb-4" />
          <StatusTabs currentFilter={currentFilter} onFilter={handleFilter} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <TaskFormWrapper 
              editingTask={editingTask} 
              onSubmit={handleCreateOrUpdate} 
              onCancel={() => setEditingTask(null)} 
            />
            <TaskListWrapper 
              tasks={tasks} 
              currentFilter={currentFilter}
              onEdit={(task) => setEditingTask(task)}
              onDelete={handleDelete}
              onAssign={handleAssign}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
