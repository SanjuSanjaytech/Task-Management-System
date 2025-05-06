import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});