import { create } from "zustand";

const useFavoriteStore = create((set) => ({
    favorites: [],
    init: (ids) => set({ favorites: ids }),
    toggle: (id) => {
        set((state) => {
            if (state.favorites?.includes(id)) {
                return { favorites: state.favorites.filter(itemId => itemId !== id) };
            } else {
                return { favorites: [...state.favorites, id] };
            }
        });
    },
    clear: () => set({ favorites: [] })
}));


export default useFavoriteStore;
