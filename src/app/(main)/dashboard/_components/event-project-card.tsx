import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  MoreHorizontal,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import { getNameInitials } from '@/lib/utils';

const EventProjectCard = ({
  project,
}: {
  project: {
    title: string;
    logo: string;
    company: string;
    tasks: string[];
    inProgress: boolean;
    completed: boolean;
    dueDate: string;
    assignee: string;
    lastEditedAvatar: string;
    categoryColor: string;
    category: string;
    lastEdited: string;
    team: [];
    comments: [];
    attachments: [];
    progress: number;
  };
}) => {
  return (
    <div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 flex justify-between items-start">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12">{project.logo}</Avatar>
              <div>
                <h3 className="font-medium">{project.company}</h3>
                <p className="text-gray-500">{project.title}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-y border-gray-100 dark:border-gray-800">
            <div className="p-4 text-center">
              <div className="text-2xl font-semibold">
                {project.tasks}
              </div>
              <div className="text-sm text-gray-500">Tasks</div>
            </div>
            <div className="p-4 text-center border-x border-gray-100 dark:border-gray-800">
              <div className="text-2xl font-semibold">
                {project.inProgress}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-semibold">
                {project.completed}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Due date</div>
                <div>{project.dueDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      project.categoryColor
                    }`}
                  />
                  {project.category}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Assignee</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={'/placeholder.svg'}
                      alt={project.assignee}
                    />
                    <AvatarFallback>
                      {getNameInitials(project.assignee)}
                    </AvatarFallback>
                  </Avatar>
                  {project.assignee}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Last edited
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    {project.lastEditedAvatar}
                  </Avatar>
                  {project.lastEdited}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Team:</div>
              <div className="flex items-center gap-1">
                {project.team.map((member, i) => (
                  <Avatar
                    key={i}
                    className="h-6 w-6 -ml-1 first:ml-0 border-2 border-white dark:border-gray-900"
                  >
                    {member}
                  </Avatar>
                ))}
                <span className="text-sm text-gray-500 ml-1">+2</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {project.comments}
                </div>
                <div className="flex items-center gap-1">
                  <Paperclip className="h-4 w-4" />
                  {project.attachments}
                </div>
              </div>
              <Progress value={project.progress} className="w-1/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventProjectCard;
