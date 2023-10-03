import { create } from "zustand";

interface SearchStore {
  username: string;
  onSearch: (name: string) => void;
  onClose: () => void;
}

const useSearch = create<SearchStore>((set) => ({
  username: "",
  onSearch: (name: string) => set({ username: name }),
  onClose: () => set({ username: "" }),
}));

export default useSearch;
