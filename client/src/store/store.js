import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getUserDetails, getUserId } from "../components/api/user";
import { getUserProjects } from "../components/api/projects";

import io from "socket.io-client";

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

export const useChatStore = create((set, get) => ({
  socket: io.connect(import.meta.env.VITE_SERVER_URL),
}));

export const useGoogleStore = create(
  persist(
    (set, get) => ({
      accessToken: {},
      setAccessToken: (googleAccessToken) =>
        set({ accessToken: googleAccessToken }),
      clearAccessToken: () => set({ accessToken: {} }),
    }),
    {
      name: "access-token",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
