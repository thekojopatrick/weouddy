"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

import EventProjectCard from "./event-project-card";
import Image from "next/image";
import { ProfileHeader } from "./profile-header";
import { ProfileStatsComponent } from "./profile-stats";
import { ProfileViewStatsComponent } from "./profile-view-stats";
import ProfileSetupComponets from "./profile-setup";
import PartnersList from "./partners-list";

interface DashboardOverviewProps {
  profile: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    stats: {
      following: number;
      followers: number;
      events: number;
      posts: number;
    };
    isOwnProfile?: boolean;
    isFollowing?: boolean;
    allowFollowers?: boolean;
  };
}

const projects = [
  {
    company: "Slack Inc.",
    title: "Illustration of Materials Design",
    logo: <Image width={100} height={100} src="/placeholder.svg" alt="Slack" />,
    tasks: 34,
    inProgress: 19,
    completed: 14,
    dueDate: "12 July, 2024",
    category: "Illustration",
    categoryColor: "bg-purple-400",
    assignee: "Amanda Harvey",
    lastEdited: "James Collins",
    lastEditedAvatar: (
      <Image width={100} height={100} src="/placeholder.svg" alt="James" />
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
    company: "Notion",
    title: "Add missing plugin demos to docs",
    logo: "N",
    tasks: 9,
    inProgress: 0,
    completed: 9,
    dueDate: "4 June, 2024",
    category: "UI/UX",
    categoryColor: "bg-red-400",
    assignee: "Daniel Hobbs",
    lastEdited: "Daniel Hobbs",
    lastEditedAvatar: (
      <Image width={100} height={100} src="/placeholder.svg" alt="Daniel" />
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
    company: "Dropbox Inc.",
    title: "Datatables integration",
    logo: "D",
    tasks: 101,
    inProgress: 51,
    completed: 50,
    dueDate: "31 August, 2024",
    category: "Datatables",
    categoryColor: "bg-blue-400",
    assignee: "Amanda Harvey",
    lastEdited: "Liza Harrison",
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

const OverviewDashboard = ({ profile }: DashboardOverviewProps) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <ProfileHeader {...profile} />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Setup Card */}
          <ProfileSetupComponets />

          {/* Profile Card */}
          <ProfileStatsComponent />

          {/* Page view */}
          <ProfileViewStatsComponent />
        </div>

        {/* Partners Section */}
        <PartnersList />
        {/* Projects Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">Projects</h2>
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
              <EventProjectCard key={index} project={project as never} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
