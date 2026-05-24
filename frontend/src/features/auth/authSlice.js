import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:8000/api/auth/';

// Read token from localStorage on app start
const savedToken = localStorage.getItem('token');

// Decode token to check if admin
const decodeToken = (token) => {
  try {
    const base64 = token.split('.')[1];
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch {
    return null;
  }
};

const decoded = savedToken ? decodeToken(savedToken) : null;

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(API + 'register/', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Registration failed' });
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(API + 'login/', data);
    localStorage.setItem('token', res.data.access);
    const decoded = decodeToken(res.data.access);
    return {
      token: res.data.access,
      isAdmin: decoded?.is_staff || decoded?.is_superuser || false,
    };
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Login failed' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken || null,
    isAdmin: decoded?.is_staff || decoded?.is_superuser || false,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      localStorage.removeItem('token');
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.error = 'Invalid email or password';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;