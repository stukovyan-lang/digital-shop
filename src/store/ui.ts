import { create } from 'zustand';

export type Toast = { id: number; message: string };

type UiState = {
  toasts: Toast[];
  push: (message: string) => void;
  dismiss: (id: number) => void;
};

let seq = 0;

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  push: (message) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => get().dismiss(id), 2600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Показать тост из любого места: toast('Текст скопирован') */
export const toast = (message: string) => useUiStore.getState().push(message);
