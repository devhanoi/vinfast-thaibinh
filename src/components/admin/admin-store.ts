"use client";

import { create } from "zustand";

type AdminUiState = {
  sidebarOpen: boolean;
  productSearch: string;
  setSidebarOpen: (open: boolean) => void;
  setProductSearch: (value: string) => void;
};

export const useAdminUiStore = create<AdminUiState>((set) => ({
  sidebarOpen: false,
  productSearch: "",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setProductSearch: (productSearch) => set({ productSearch }),
}));
