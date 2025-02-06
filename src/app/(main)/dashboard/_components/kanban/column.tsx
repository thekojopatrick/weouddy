"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Task } from "@/stores/use-kanban-store";

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const Column = ({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="shrink-0 w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full  border">
          <h2 className="font-medium text-gray-700 text-sm">{title}</h2>
          <span className="text-sm text-gray-500">{tasks.length}</span>
        </div>
        <Button
          onClick={onAddTask}
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div ref={setNodeRef} className="rounded-lg  min-h-[calc(100vh-12rem)]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
