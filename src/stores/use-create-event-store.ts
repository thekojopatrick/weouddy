import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EventFormValues } from '@/types/validation';

// Define the store state and actions interface
interface CreateEventState {
  // Partial form values to allow incremental saving
  formData: Partial<EventFormValues>;
  currentStep:
    | 'welcome'
    | 'details'
    | 'location'
    | 'cover'
    | 'privacy'
    | null;

  // Actions to update the store
  updateFormData: (data: Partial<EventFormValues>) => void;
  updateStep: (step: CreateEventState['currentStep']) => void;
  resetStore: () => void;
}

// Default initial state
const defaultInitialState = {
  formData: {},
  currentStep: null,
};

// Create the Zustand store with persistence
export const useCreateEventStore = create<CreateEventState>()(
  persist(
    (set) => ({
      ...defaultInitialState,

      // Update form data partially
      updateFormData: (newData) =>
        set((state) => ({
          formData: { ...state.formData, ...newData },
        })),

      // Update current step
      updateStep: (step) => set({ currentStep: step }),

      // Reset the entire store
      resetStore: () => set(defaultInitialState),
    }),
    {
      name: 'create-event-store', // unique name for localStorage
      // Optional: specify which parts of the state to persist
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);
