import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type contactId = {
    index: number;
    id: string;
};

interface UseContactsNav {
    limit: number;
    offset: number;
    setLimit: (limit: number) => void;
    setOffset: (offset: number) => void;
    listId: string;
    setListId: (id: string) => void;
    contactIds: contactId[];
    setContactIds: (ids: contactId[]) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    totalPages: number;
    setTotalPages: (pages: number) => void;
}

export const useContactsNav = create<UseContactsNav>()(
    persist(
        (set) => ({
            limit: 20,
            offset: 0,
            setLimit: (limit: number) => set({ limit }),
            setOffset: (offset: number) => set({ offset }),
            listId: '',
            setListId: (id: string) => set({ listId: id }),
            contactIds: [] as contactId[],
            setContactIds: (ids: contactId[]) => set({ contactIds: ids }),
            currentIndex: 0,
            setCurrentIndex: (index: number) => set({ currentIndex: index }),
            totalPages: 0,
            setTotalPages: (pages: number) => set({ totalPages: pages }),
        }),
        { name: 'contacts-nav-storage' }
    )
);
