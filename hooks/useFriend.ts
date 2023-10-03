import { create } from "zustand";

interface Props {
  userId: string;
  chatId: string;
  memberId: string;
}

interface FriendStore {
  userId: string;
  chatId: string;
  memberId: string;
  isOpen: boolean;
  onOpen: ({ userId, chatId }: Props) => void;
  onClose: () => void;
}

const useFriend = create<FriendStore>((set) => ({
  userId: "",
  chatId: "",
  memberId: "",
  isOpen: false,
  onOpen: ({ chatId, userId, memberId }) =>
    set({ isOpen: true, userId, chatId, memberId }),
  onClose: () => set({ isOpen: false }),
}));

export default useFriend;
