import { create } from "zustand";

import { getUserProjects } from "../components/api/projects";
import { getUserId } from "../components/api/user";

export const useUserStore = create((set, get) => ({
  userDetails: {},
  setUserDetails: async () => set({ userDetails: data }),
  clearUserDetails: () => set({ userDetails: {} }),
  // setDetails: (data) => set({
  //   userDetails: {...get().userDetails, data}
  // })
}));

export const useProjectStore = create((set, get) => ({
  projects: [],
  setProjects: async () => {
    const data = await getUserProjects(getUserId().userId);

    set({ projects: data });
  },
}));

export const useGroupStore = create((set, get) => ({
  groups: [],
  setGroups: (data) => set({ groups: data }),
}));
