'use client';

import React, { useState } from 'react';

import { CreatePostDialog } from './test-create-post';
import { cn } from '@/lib/utils';

const CreatePostButton = ({
  eventId,
  user,
}: {
  isSmallDevice?: boolean;
  eventId: string;
  user: {
    id?: string;
    userName: string;
    userAvatar: string;
  };
}) => {
  return (
    <>
      <CreatePostDialog
        eventId={eventId}
        userId={user.id!}
        userName={user.userName}
        userAvatar={user.userAvatar}
      />
    </>
  );
};

export default CreatePostButton;
