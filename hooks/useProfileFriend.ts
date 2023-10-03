import { create } from "zustand";

interface FrofileFriendStore {
  username: string;
  isOpen: boolean;
  onOpen: (name: string) => void;
  onClose: () => void;
}

const useProfileFriend = create<FrofileFriendStore>((set) => ({
  username: "",
  isOpen: false,
  onOpen: (name: string) => set({ isOpen: true, username: name }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfileFriend;
