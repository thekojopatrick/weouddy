'use client';

import { CustomTabs, TabItem } from '@/components/ui/custom-tabs';

import { UserEvents } from './user-events';
import { UserPosts } from './user-posts';
import RequestsList from './user-events-requests';

interface ProfileTabsProps {
  stats: {
    following: number;
    followers: number;
    events: number;
    posts: number;
  };
  userId: string;
}

export function ProfileTabs({ stats, userId }: ProfileTabsProps) {
  const tabItems: TabItem[] = [
    {
      value: 'posts',
      label: `Posts ${stats.posts}`,
      content: <UserPosts userId={userId} />,
    },
    {
      value: 'events',
      label: `Events ${stats.events}`,
      content: <UserEvents userId={userId} />,
    },
    {
      value: 'requests',
      label: `E-Requests`,
      content: <RequestsList />,
    },
  ];

  return (
    <CustomTabs
      items={tabItems}
      variant="underline"
      defaultValue="posts"
    />
  );
}
