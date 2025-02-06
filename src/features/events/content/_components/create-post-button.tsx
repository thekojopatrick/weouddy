"use client";

import React from "react";

import { CreatePostDialog } from "./create-post-modal";

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
