import { create } from "zustand";
import * as AuthService from "../appwriteconfig/authservices"; 
import { Models } from "appwrite";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;

  loginUser: (email: string, password: string) => Promise<void>;
  signupUser: (email: string, password: string, name: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  // Login function
  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await AuthService.login(email, password);
      const user = await AuthService.getCurrentUser();
      set({ user, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Login failed" });
    }
  },

  // Signup function
  signupUser: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      await AuthService.createAccount(email, password, name);
      await AuthService.login(email, password); // Auto login
      const user = await AuthService.getCurrentUser();
      set({ user, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Signup failed" });
    }
  },

  // Fetch current user (on page load)
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await AuthService.getCurrentUser();
      set({ user, loading: false });
    } catch (err: any) {
      set({ user: null, loading: false, error: err?.message || null });
    }
  },

  // Logout function
  logoutUser: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.logout();
      set({ user: null, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Logout failed" });
    }
  },
}));
