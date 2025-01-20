'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Check,
  Building2,
  FolderKanban,
  ChevronDown,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import InviteModal from './invite-modal';
import EventProjectCard from './event-project-card';
import Image from 'next/image';

const expensesData = [
  { month: 'Jan', amount: 18000 },
  { month: 'Feb', amount: 27000 },
  { month: 'Mar', amount: 28000 },
  { month: 'Apr', amount: 32000 },
  { month: 'May', amount: 15000 },
  { month: 'Jun', amount: 29000 },
  { month: 'Jul', amount: 25000 },
  { month: 'Aug', amount: 14000 },
  { month: 'Sep', amount: 19000 },
  { month: 'Oct', amount: 28000 },
  { month: 'Nov', amount: 17000 },
  { month: 'Dec', amount: 30000 },
];

const projects = [
  {
    company: 'Slack Inc.',
    title: 'Illustration of Materials Design',
    logo: (
      <Image
        width={100}
        height={100}
        src="/placeholder.svg"
        alt="Slack"
      />
    ),
    tasks: 34,
    inProgress: 19,
    completed: 14,
    dueDate: '12 July, 2024',
    category: 'Illustration',
    categoryColor: 'bg-purple-400',
    assignee: 'Amanda Harvey',
    lastEdited: 'James Collins',
    lastEditedAvatar: (
      <Image
        width={100}
        height={100}
        src="/placeholder.svg"
        alt="James"
      />
    ),
    team: [
      <Image
        width={100}
        height={100}
        key="1"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <Image
        width={100}
        height={100}
        key="2"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <Image
        width={100}
        height={100}
        key="3"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <AvatarFallback key="4">L</AvatarFallback>,
    ],
    comments: 2,
    attachments: 1,
    progress: 38,
  },
  {
    company: 'Notion',
    title: 'Add missing plugin demos to docs',
    logo: 'N',
    tasks: 9,
    inProgress: 0,
    completed: 9,
    dueDate: '4 June, 2024',
    category: 'UI/UX',
    categoryColor: 'bg-red-400',
    assignee: 'Daniel Hobbs',
    lastEdited: 'Daniel Hobbs',
    lastEditedAvatar: (
      <Image
        width={100}
        height={100}
        src="/placeholder.svg"
        alt="Daniel"
      />
    ),
    team: [
      <Image
        width={100}
        height={100}
        key="1"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <Image
        width={100}
        height={100}
        key="2"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <Image
        width={100}
        height={100}
        key="3"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <AvatarFallback key="4">L</AvatarFallback>,
    ],
    comments: 4,
    attachments: 41,
    progress: 100,
  },
  {
    company: 'Dropbox Inc.',
    title: 'Datatables integration',
    logo: 'D',
    tasks: 101,
    inProgress: 51,
    completed: 50,
    dueDate: '31 August, 2024',
    category: 'Datatables',
    categoryColor: 'bg-blue-400',
    assignee: 'Amanda Harvey',
    lastEdited: 'Liza Harrison',
    lastEditedAvatar: <AvatarFallback>L</AvatarFallback>,
    team: [
      <Image
        width={100}
        height={100}
        key="1"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <Image
        width={100}
        height={100}
        key="2"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <Image
        width={100}
        height={100}
        key="3"
        src="/placeholder.svg"
        alt="Team member"
      />,
      <AvatarFallback key="4">L</AvatarFallback>,
    ],
    comments: 56,
    attachments: 14,
    progress: 50,
  },
];

const Dashboard = () => {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 rounded-xl p-2 w-12 h-12">
              <Image
                width={100}
                height={100}
                src="/placeholder.svg"
                alt="Mailchimp logo"
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-black text-xl font-semibold">
                Mailchimp
              </h1>
              <p className="text-gray-400 text-sm">
                Marketing, Automation & Email Platform
              </p>
            </div>
          </div>
          <>
            <InviteModal
              open={inviteModalOpen}
              onOpenChange={setInviteModalOpen}
            />

            {/* Update the Invite talents button */}
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setInviteModalOpen(true)}
            >
              <Plus size={16} />
              Invite talents
            </Button>
          </>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Setup Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile setup</CardTitle>
                <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">
                  PRO
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>2 of 4 completed</span>
                    <span className="text-gray-500">
                      50% complete
                    </span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>

                <p className="text-sm text-gray-500">
                  Your profile needs to be at least 50% complete to be
                  publicly visible.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="text-green-500" size={20} />
                      <span className="text-gray-400 line-through">
                        Download desktop app
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building2
                        className="text-gray-400"
                        size={20}
                      />
                      <span>Provide company details</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Add now
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="text-green-500" size={20} />
                      <span className="text-gray-400 line-through">
                        Invite 5 talents
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Invite
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-100/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FolderKanban
                        className="text-gray-400"
                        size={20}
                      />
                      <span>Add projects</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Add now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Expenses</CardTitle>
                <Button variant="outline" className="gap-2">
                  25 Jul - 25 Aug
                  <ChevronDown size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-3xl font-bold">$307,000</h3>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expensesData}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip />
                    <Bar
                      dataKey="amount"
                      fill="#4DB6AC"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Talents Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Talents</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Status:
                  </span>
                  <Button variant="outline" className="gap-2">
                    All
                    <ChevronDown size={16} />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort:</span>
                  <Button variant="outline" className="gap-2">
                    Newest
                    <ChevronDown size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Talent Cards */}
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-100/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <Image
                        width={100}
                        height={100}
                        src="/placeholder.svg"
                        alt="Amanda Harvey"
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Amanda Harvey</h3>
                      <p className="text-sm text-gray-500">
                        Front-End Developer | (892) 312-5483 |
                        amanda@email.com
                      </p>
                    </div>
                  </div>
                  <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-sm">
                    PRO
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-100/5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="bg-pink-200">
                      <span className="text-pink-700">D</span>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Daniel Hobbs</h3>
                      <p className="text-sm text-gray-500">
                        Mobile Developer | +1 000-00-00 |
                        bob@email.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add more talent cards as needed */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Projects
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Status:</span>
                <Button variant="outline" className="gap-2">
                  All
                  <ChevronDown size={16} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort:</span>
                <Button variant="outline" className="gap-2">
                  Newest
                  <ChevronDown size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <EventProjectCard
                key={index}
                project={project as never}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
