import { create } from "zustand";

type TransferStore = {
  selectedIds: string[];

  addId: (id: string) => void;
  removeId: (id: string) => void;
  toggleId: (id: string) => void;
  clearIds: () => void;
};

export const useTransferStore = create<TransferStore>((set) => ({
  selectedIds: [],

  addId: (id) =>
    set((state) => ({
      selectedIds: [...state.selectedIds, id],
    })),

  removeId: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((item) => item !== id),
    })),

  toggleId: (id) =>
    set((state) => {
      const exists = state.selectedIds.includes(id);

      return {
        selectedIds: exists
          ? state.selectedIds.filter((item) => item !== id)
          : [...state.selectedIds, id],
      };
    }),

  clearIds: () => set({ selectedIds: [] }),
}));