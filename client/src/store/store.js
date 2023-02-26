import { create } from "zustand";

import { getUserDetails, getUserId } from "../components/api/user";
import { getUserProjects } from "../components/api/projects";

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
  selectedProject: [],
  setSelectedProject: (projectId) =>
    set({
      selectedProject: get().projects.filter(
        (project) => project._id === projectId
      ),
    }),
}));

export const useGroupStore = create((set, get) => ({
  groups: [],
  setGroups: async (groups) => set({ groups: groups }),
}));
