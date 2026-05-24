import { create } from "zustand";

type AdminUI = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
};

export const useAdminUI = create<AdminUI>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  editingId: null,
  setEditingId: (editingId) => set({ editingId }),
}));
