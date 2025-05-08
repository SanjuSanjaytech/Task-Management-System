import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, assignTask } from '../redux/slices/taskSlice';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  Bars3BottomLeftIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  PencilSquareIcon, 
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SearchFilterBar = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ 
      search: searchTerm,
      priority,
      dueDate
    });
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search tasks..."
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default function Tasks() {
  const [editingTask, setEditingTask] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const handleSearch = (filters) => {
    dispatch(fetchTasks({ 
      ...filters, 
      status: currentFilter === 'all' ? undefined : currentFilter 
    }));
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, task: taskData })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(taskData)).unwrap();
        toast.success('Task created successfully');
      }
      setEditingTask(null);
      setActiveTab('list');
      dispatch(fetchTasks({ status: currentFilter === 'all' ? undefined : currentFilter }));
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
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

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <p className="text-gray-600">Efficiently organize and track your tasks</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6">
            <SearchFilterBar 
              onSearch={handleSearch}
              className="mb-4"
            />

            {/* Status Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide">
              {[
                { status: 'all', label: 'All Tasks', icon: Bars3BottomLeftIcon },
                { status: 'pending', label: 'Pending', icon: ClockIcon },
                { status: 'completed', label: 'Completed', icon: CheckCircleIcon },
              ].map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.status}
                    onClick={() => handleFilter(filter.status)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 mr-2 rounded-lg text-sm font-medium ${
                      currentFilter === filter.status
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  activeTab === 'form' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {editingTask ? 'Edit Task' : 'Add Task'}
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  activeTab === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                View Tasks
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Form */}
            <div className={`${activeTab === 'list' ? 'hidden lg:block' : ''}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center mb-5">
                  <div className="p-2 rounded-md bg-indigo-50 mr-3">
                    {editingTask ? (
                      <PencilSquareIcon className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <PlusIcon className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h2>
                </div>
                <TaskForm
                  task={editingTask}
                  onSubmit={handleCreateOrUpdate}
                  onCancel={() => {
                    setEditingTask(null);
                    if (window.innerWidth < 1024) setActiveTab('list');
                  }}
                />
              </div>
            </div>

            {/* Task List */}
            <div className={`${activeTab === 'form' ? 'hidden lg:block' : ''}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-center mb-5">
                  <div className="p-2 rounded-md bg-indigo-50 mr-3">
                    <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Task List</h2>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-10">
                    <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">No tasks found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {currentFilter === 'all' 
                        ? "Create your first task to get started."
                        : `No ${currentFilter} tasks match your filters.`}
                    </p>
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        if (window.innerWidth < 1024) setActiveTab('form');
                      }}
                      className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      New Task
                    </button>
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onEdit={(task) => {
                      setEditingTask(task);
                      if (window.innerWidth < 1024) setActiveTab('form');
                    }}
                    onDelete={handleDelete}
                    onAssign={handleAssign}
                  />
                )}
              </div>  
            </div>  
          </div>
        </div>
      </div>
    </Layout>
  );
}