import { create } from "zustand";

type AdminPortfolioState = {
  mode: "edit" | "new" | null;
  selectedProjectId: string | null;
  isRightSidebarOpen: boolean;
  selectProject: (id: string) => void;
  openNewProject: () => void;
  closeRightSidebar: () => void;
  clearSelection: () => void;
};

export const useAdminPortfolioStore = create<AdminPortfolioState>((set) => ({
  mode: null,
  selectedProjectId: null,
  isRightSidebarOpen: true,
  selectProject: (id) =>
    set({ mode: "edit", selectedProjectId: id, isRightSidebarOpen: true }),
  openNewProject: () =>
    set({ mode: "new", selectedProjectId: null, isRightSidebarOpen: true }),
  closeRightSidebar: () => set({ isRightSidebarOpen: false }),
  clearSelection: () =>
    set({ mode: null, selectedProjectId: null, isRightSidebarOpen: true }),
}));
