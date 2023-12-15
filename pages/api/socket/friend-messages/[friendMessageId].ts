import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfileForPages(req);
    const { friendshipId, messageId } = req.query;
    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!friendshipId) {
      return res.status(400).json({ error: "FriendshipId missing" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "Message ID missing" });
    }

    const friendship = await db.conversationBetweenFriends.findFirst({
      where: {
        id: friendshipId as string,
        OR: [
          {
            friendOneId: profile.id,
          },
          {
            friendTwoId: profile.id,
          },
        ],
      },
      include: {
        friendOne: true,
        friendTwo: true,
      },
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    let message = await db.directMessageBetweenFriends.findFirst({
      where: {
        id: messageId as string,
      },
      include: {
        friend: true,
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.friend.id !== profile.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "PATCH") {
      message = await db.directMessageBetweenFriends.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content as string,
          fileUrl,
        },
        include: {
          friend: true,
        },
      });
    }

    if (req.method === "DELETE") {
      message = await db.directMessageBetweenFriends.update({
        where: {
          id: messageId as string,
        },
        data: {
          deleted: true,
        },
        include: {
          friend: true,
        },
      });
    }

    const updateKey = `chat:${friendship.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, "update msg");

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal error" });
  }
}
