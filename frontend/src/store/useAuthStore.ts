import { create } from "zustand";
import axios from "axios";
import type { User } from "../types/user";
import type { LoginCredentials, SignupCredentials } from "../types/auth";

interface AuthStore {
  user: User | null;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  error: string | null;
  signin: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isLoggingOut: false,
  isSigningUp: false,
  error: null,

  signin: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials, {
        withCredentials: true,
      });
      set({ user: response.data.user });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Signin failed",
          user: null,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          user: null,
        });
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post("/api/v1/auth/login", credentials, {
        withCredentials: true,
      });
      set({ user: response.data.user });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Login failed",
          user: null,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          user: null,
        });
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Logout failed",
        });
      } else {
        set({
          error: "Unexpected error occurred",
        });
      }
    } finally {
      set({ user: null, isLoggingOut: false });
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/api/v1/auth/authCheck", {
        withCredentials: true,
      });
      set({ user: response.data.user, error: null });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || "Not Authenticated",
          user: null,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          user: null,
        });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
