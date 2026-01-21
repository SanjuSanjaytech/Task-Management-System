import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTasks as apiGetTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  assignTask as apiAssignTask,
  getDashboard as apiGetDashboard,
} from '../../utils/api';

// --- Async Thunks ---
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await apiGetTasks(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch tasks' });
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task, { rejectWithValue }) => {
    try {
      const response = await apiCreateTask(task);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create task' });
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateTask(id, task);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update task' });
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete task' });
    }
  }
);

export const assignTask = createAsyncThunk(
  'tasks/assignTask',
  async ({ taskId, userId }, { rejectWithValue }) => {
    try {
      const response = await apiAssignTask(taskId, { userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to assign task' });
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  'tasks/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetDashboard();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch dashboard' });
    }
  }
);

// --- Slice ---
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    tasksAssigned: [],
    tasksCreated: [],
    overdueTasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optimistic updates
    addTaskToStore: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTaskInStore: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) state.tasks[index] = action.payload;
    },
    deleteTaskFromStore: (state, action) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Tasks ---
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // --- Create Task ---
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload); // still push for final confirmation
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // --- Update Task ---
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // --- Delete Task ---
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // --- Assign Task ---
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // --- Fetch Dashboard ---
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.tasksAssigned = action.payload.tasksAssigned;
        state.tasksCreated = action.payload.tasksCreated;
        state.overdueTasks = action.payload.overdueTasks;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { addTaskToStore, updateTaskInStore, deleteTaskFromStore } = taskSlice.actions;
export default taskSlice.reducer;
