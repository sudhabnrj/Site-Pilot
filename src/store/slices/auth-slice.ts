import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  plan?: "starter" | "pro" | "enterprise";
  isEmailVerified?: boolean;
  profileImage?: string;
  lastLogin?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
    },
    updateUserPlan: (state, action: PayloadAction<"starter" | "pro" | "enterprise">) => {
      if (state.user) {
        state.user.plan = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isInitialized = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      state.isLoading = false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateUserPlan, logout, setLoading, setInitialized, setError } =
  authSlice.actions;

export default authSlice.reducer;
