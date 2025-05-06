import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../../utils/api';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  console.log('Login payload:', { email, password }); // Debug payload
  try {
    const response = await loginApi({ email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data, error.message); // Debug error
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    console.log('Register payload:', { name, email, password }); // Debug payload
    try {
      const response = await registerApi({ name, email, password });
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data, error.message); // Debug error
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { name: 'User', email: action.meta.arg.email }; // Backend doesn't return user data
        localStorage.setItem('token', action.payload.token);
        console.log('Token stored:', action.payload.token); // Debug token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { name: action.meta.arg.name, email: action.meta.arg.email };
        localStorage.setItem('token', action.payload.token);
        console.log('Token stored:', action.payload.token); // Debug token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;