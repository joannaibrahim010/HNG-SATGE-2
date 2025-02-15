// src/store.ts
import { create } from 'zustand';

interface FormData {
  fullName: string;
  email: string;
  avatar: string;
  request: string;
}

interface TicketStore {
  step: number;
  ticketType: string;
  ticketCount: number;
  formData: FormData;
  setTicketSelection: (type: string, count: number) => void;
  setFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  // Initial state
  step: 1,
  ticketType: 'regular',
  ticketCount: 1,
  formData: {
    fullName: '',
    email: '',
    avatar: '',
    request: ''
  },

  // Actions
  setTicketSelection: (type, count) => set({ 
    ticketType: type, 
    ticketCount: count 
  }),

  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  nextStep: () => set((state) => ({ 
    step: Math.min(state.step + 1, 3) 
  })),

  prevStep: () => set((state) => ({ 
    step: Math.max(state.step - 1, 1) 
  })),

  reset: () => set({
    step: 1,
    ticketType: 'regular',
    ticketCount: 1,
    formData: {
      fullName: '',
      email: '',
      avatar: '',
      request: ''
    }
  })
}));