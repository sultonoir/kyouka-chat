import { create } from "zustand";

interface OnOpen {
  groupId: string;
  memberId: string;
}

interface GroupStore {
  isOpen: boolean;
  groupId: string;
  memberId: string;
  onOpen: ({ groupId, memberId }: OnOpen) => void;
  onClose: () => void;
}

const useGroupChat = create<GroupStore>((set) => ({
  isOpen: false,
  groupId: "",
  memberId: "",
  onOpen: ({ groupId, memberId }) => set({ isOpen: true, groupId, memberId }),
  onClose: () => set({ isOpen: false }),
}));

export default useGroupChat;
