"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const searchForMessage = async (query: string, channelId: string) => {
  if (query) {
    const messages = await db.message.findMany({
      where: {
        content: {
          contains: query,
        },
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return messages;
  }
};

export const searchForDirectMessage = async (
  query: string,
  memberId: string,
  serverId: string
) => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("Unauthorized");
  }

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: serverId,
    },
  });

  if (!member) {
    throw new Error("Member doesnt exist on the server");
  }

  const conversation = await db.conversation.findFirst({
    where: {
      OR: [
        {
          memberOneId: memberId,
          memberTwoId: member.id,
        },
        {
          memberTwoId: memberId,
          memberOneId: member.id,
        },
      ],
    },
  });

  if (!conversation) {
    throw new Error("Conversation doesnt exist");
  }

  if (query) {
    const messages = await db.directMessage.findMany({
      where: {
        content: {
          contains: query,
        },
        conversationId: conversation.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return messages;
  }
};

export const searchForFriendMessage = async (
  query: string,
  conversationId: string
) => {
  const messages = await db.friendshipMessage.findMany({
    where: {
      content: {
        contains: query,
      },
      conversationId,
    },
    include: {
      friend: true,
    },
  });

  return messages;
};

