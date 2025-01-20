'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import type { Task } from '@/stores/use-kanban-store';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export const TaskCard = ({
  task,

  ...props
}: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm border mb-3 p-4"
      {...attributes}
      {...listeners}
      {...props}
    >
      <h3 className="font-medium text-gray-900 mb-3">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-500 mt-1">
          {task.description}
        </p>
      )}
      <div className="space-y-2 text-sm text-gray-600">
        {task.totalHours && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Total hours: {task.totalHours}</span>
          </div>
        )}
        {task.days && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Days: {task.days}</span>
          </div>
        )}
        {task.cost && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Project cost: ${task.cost.toLocaleString()}</span>
          </div>
        )}
        {task.assignees && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <div className="flex -space-x-2">
              {task.assignees.map((_, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
