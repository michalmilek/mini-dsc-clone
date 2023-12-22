"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const markAsRead = async (friendshipId: string) => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("Unauthorized");
  }

  const friendship = await db.friendship.findFirst({
    where: {
      id: friendshipId,
      OR: [
        {
          friendOneId: profile.id,
        },
        {
          friendTwoId: profile.id,
        },
      ],
    },
  });

  if (!friendship) {
    throw new Error("Friendship not found");
  }

  const secondUserId =
    friendship.friendOneId === profile.id
      ? friendship.friendTwoId
      : friendship.friendOneId;

  await db.friendshipMessage.updateMany({
    where: {
      conversationId: friendship.id,
      friendId: secondUserId,
      seen: false,
    },
    data: {
      seen: true,
    },
  });
};
