import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;
