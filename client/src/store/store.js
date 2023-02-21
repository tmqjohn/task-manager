import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  userDetails: {},
  setUserDetails: (data) => set({ userDetails: data }),
  clearUserDetails: () => set({ userDetails: {} }),
  // setDetails: (data) => set({
  //   userDetails: {...get().userDetails, data}
  // })
}));

export const useProjectStore = create((set, get) => ({
  projects: [],
  setProject: (data) => set({ projects: data }),
}));
