import { create } from 'zustand';
import { toast } from 'sonner';

type Status =
  | 'no-status'
  | 'active'
  | 'on-hold'
  | 'review'
  | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  totalHours?: string;
  days?: number;
  cost?: number;
  assignees?: string[];
  tasksCount?: number;
}

type KanbanStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'order'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;
};

export const useKanbanStore = create<KanbanStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => {
    set((state) => {
      const tasksInStatus = state.tasks.filter(
        (t) => t.status === task.status
      );
      const newTask = {
        ...task,
        id: crypto.randomUUID(),
        order: tasksInStatus.length,
      };
      toast.success('Task created successfully');
      return { tasks: [...state.tasks, newTask] };
    });
  },
  updateTask: (id, updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    }));
    toast.success('Task updated successfully');
  },
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
    toast.success('Task deleted successfully');
  },
  reorderTasks: (tasks) => {
    set({ tasks });
  },
}));
