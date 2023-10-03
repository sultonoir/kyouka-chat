import { create } from "zustand";

interface ProfileStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProfile = create<ProfileStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfile;
