'use client';
import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Column } from './column';
import { TaskCard } from './task-card';
import { TaskDialog } from './new-task-dialog';

import { useKanbanStore, Task } from '@/stores/use-kanban-store';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

const COLUMNS: { id: Task['status']; title: string }[] = [
  { id: 'no-status', title: 'To Do' },
  { id: 'active', title: 'In Progress' },
  { id: 'completed', title: 'Completed' },
];

const Index = () => {
  const { eventId } = useParams();
  const { tasks, addTask, updateTask, deleteTask, reorderTasks } =
    useKanbanStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addingToStatus, setAddingToStatus] = useState<
    Task['status'] | null
  >(null);

  useEffect(() => {
    if (!eventId) {
      toast.error('No event ID provided');
    }
  }, [eventId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overColumn = COLUMNS.find((col) => col.id === over.id);

    if (!activeTask) return;

    if (overColumn) {
      const updatedTasks = tasks.map((t) =>
        t.id === activeTask.id ? { ...t, status: overColumn.id } : t
      );
      reorderTasks(updatedTasks);
    } else {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const handleAddTask = (status: Task['status']) => {
    setAddingToStatus(status);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setAddingToStatus(null);
    setDialogOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else if (addingToStatus) {
      addTask({
        title: taskData.title!,
        description: taskData.description,
        status: addingToStatus,
      });
    }
  };

  if (!eventId) {
    return <div className="p-4">No event ID provided</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Event Planner</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-9 w-64 shadow-none"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Newest first</span>
                </Button>
                <Button variant="ghost" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              + New
            </Button>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(
                (task) => task.status === column.id
              )}
              onAddTask={() => handleAddTask(column.id)}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveTask}
        task={editingTask || undefined}
        status={addingToStatus || undefined}
      />
    </div>
  );
};

export default Index;
