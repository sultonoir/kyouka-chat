import { create } from "zustand";

interface CreateGroupStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCreateGroup = create<CreateGroupStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCreateGroup;
