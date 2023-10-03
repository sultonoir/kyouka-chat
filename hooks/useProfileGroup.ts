import { create } from "zustand";

interface Open {
  groupId: string;
  memberId: string;
}

interface FrofileGroupStore {
  groupId: string;
  memberId: string;
  isOpen: boolean;
  onOpen: ({ groupId, memberId }: Open) => void;
  onClose: () => void;
}

const useProfileGroup = create<FrofileGroupStore>((set) => ({
  groupId: "",
  isOpen: false,
  memberId: "",
  onOpen: ({ groupId, memberId }) =>
    set({ isOpen: true, groupId: groupId, memberId }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfileGroup;
