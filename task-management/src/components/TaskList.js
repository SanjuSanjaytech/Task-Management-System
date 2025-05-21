import { useState, useEffect } from 'react';
import { getUsers } from '../utils/api';
import { 
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Example StatusPill component
export function StatusPill({ status }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  };

  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Example PriorityBadge component
export function PriorityBadge({ priority }) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const colorClass = priorityColors[priority] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${colorClass}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export default function TaskList(props) {
  const {
    tasks,
    onEdit,
    onDelete,
    onAssign,
    statusPill,
    priorityBadge,
  } = props;

  // Use passed components or fallback to default examples
  const StatusPillComp = statusPill || StatusPill;
  const PriorityBadgeComp = priorityBadge || PriorityBadge;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [expandedTask, setExpandedTask] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleAssign = (taskId) => {
    if (selectedUser[taskId]) {
      onAssign(taskId, selectedUser[taskId]);
      setSelectedUser((prev) => ({ ...prev, [taskId]: '' }));
    }
  };

  const toggleExpandTask = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="border border-gray-200 rounded-xl bg-white shadow-xs hover:shadow-sm transition-shadow"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleExpandTask(task._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <PriorityBadgeComp priority={task.priority} />
                  <h3 className="font-medium text-gray-900 line-clamp-1">{task.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusPillComp status={task.status} />
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      expandedTask === task._id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                {task.assignedTo && (
                  <div className="flex items-center">
                    <UserCircleIcon className="h-4 w-4 mr-1" />
                    <span>{task.assignedTo.name}</span>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedTask === task._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4"
                >
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 mb-4">{task.description || 'No description provided'}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Assign Task Section */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Assign to team member
                        </label>
                        <div className="flex space-x-2">
                          <select
                            value={selectedUser[task._id] || ''}
                            onChange={(e) =>
                              setSelectedUser((prev) => ({ ...prev, [task._id]: e.target.value }))
                            }
                            disabled={isLoadingUsers}
                            className="flex-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
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
                            disabled={!selectedUser[task._id]}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <UserPlusIcon className="h-4 w-4 mr-1" />
                            Assign
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-end space-x-2">
                        <button
                          onClick={() => onEdit(task)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PencilSquareIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(task._id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or create a new task.
          </p>
        </div>
      )}
    </div>
  );
}
