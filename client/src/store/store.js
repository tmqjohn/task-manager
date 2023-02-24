import { create } from "zustand";

import { getUserProjects } from "../components/api/projects";
import { getUserDetails, getUserId } from "../components/api/user";

export const useUserStore = create((set, get) => ({
  userDetails: {},
  setUserDetails: async () => {
    const data = await getUserDetails();

    set({ userDetails: data });
  },
  clearUserDetails: () => set({ userDetails: {} }),
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
