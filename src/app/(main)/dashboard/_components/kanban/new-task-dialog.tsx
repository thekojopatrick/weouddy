'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Clock,
  Calendar,
  DollarSign,
  Target,
  User,
  Paperclip,
  RefreshCw,
  Mic,
  MoreVertical,
  X,
} from 'lucide-react';
import type { Task } from '@/stores/use-kanban-store';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task;
  status?: Task['status'];
}

export const TaskDialog = ({
  open,
  onOpenChange,
  onSave,
  task,
  status,
}: TaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');
  const [cost, setCost] = useState('');
  const [tasks, setTasks] = useState('');
  const [assignee, setAssignee] = useState('');
  const [assignees, setAssignees] = useState<[]>();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setHours(task.totalHours || '');
      setDays(task.days?.toString() || '');
      setCost(task.cost?.toString() || '');
      setTasks(task.tasksCount?.toString() || '');
      setAssignees(task.assignees as []);
    } else {
      setTitle('');
      setHours('');
      setDays('');
      setCost('');
      setTasks('');
      setAssignee('');
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      totalHours: hours,
      days: Number(days) || undefined,
      cost: Number(cost) || undefined,
      tasksCount: Number(tasks) || undefined,
      assignees,
      ...(status && { status }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] p-0"
        closebtnstyle="hidden"
      >
        <DialogHeader className="px-4 py-2 flex flex-row justify-between items-center border-b">
          <DialogTitle className="text-lg">New task</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-medium">T</span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border-0 text-lg font-medium placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <Input
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Total hours"
                  className="border-0 focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <Input
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Days"
                  type="number"
                  className="border-0 focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <Input
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Project cost"
                  type="number"
                  className="border-0 focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-gray-500" />
                <Input
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder="Tasks"
                  type="number"
                  className="border-0 focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <Input
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Assignee"
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Message..."
              className="max-w-[200px] h-8"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
