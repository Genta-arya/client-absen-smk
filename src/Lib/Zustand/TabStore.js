import { create } from "zustand";

const TabStore = create((set) => ({
  tab: "siswa",
  setTab: (tab) => set({ tab }),
 
}));

export default TabStore;
