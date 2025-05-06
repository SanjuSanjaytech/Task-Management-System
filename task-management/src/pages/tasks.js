import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, assignTask } from '../redux/slices/taskSlice';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-toastify';

export default function Tasks() {
  const [editingTask, setEditingTask] = useState(null);
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  const handleSearch = (filters) => {
    dispatch(fetchTasks(filters));
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ id: editingTask._id, task: taskData })).unwrap();
        toast.success('Task updated');
      } else {
        await dispatch(createTask(taskData)).unwrap();
        toast.success('Task created');
      }
      setEditingTask(null);
      dispatch(fetchTasks());
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      toast.success('Task deleted');
      dispatch(fetchTasks());
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleAssign = async (taskId, userId) => {
    try {
      await dispatch(assignTask({ taskId, userId })).unwrap();
      toast.success('Task assigned');
      dispatch(fetchTasks());
    } catch (error) {
      toast.error(error.message || 'Failed to assign task');
    }
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <TaskForm task={editingTask} onSubmit={handleCreateOrUpdate} />
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onAssign={handleAssign}
          />
        )}
      </div>
    </Layout>
  );
}