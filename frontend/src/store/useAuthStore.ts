import { create } from "zustand";
import axios from "axios";
import { User } from "../types/user";
import { LoginCredentials, SignupCredentials } from "../types/auth";

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
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Signin failed",
        user: null,
      });
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
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        user: null,
      });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Logout failed" });
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
    } catch (error: any) {
      set({
        user: null,
        error: error.response?.data?.message || "Not authenticated",
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
