import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfileForPages(req);
    const { content, fileUrl } = req.body;
    const { friendshipId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!friendshipId) {
      return res.status(400).json({ error: "FriendshipId missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation = await db.conversationBetweenFriends.findFirst({
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

    if (!conversation) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    const message = await db.directMessageBetweenFriends.create({
      data: {
        content: content as string,
        fileUrl,
        conversationId: friendshipId as string,
        friendId: profile.id,
      },
      include: {
        friend: true,
      },
    });

    const channelKey = `chat:${conversation.id}:messages`;

    res?.socket?.server?.io?.emit(channelKey, "new msg");

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST_SOCKET]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
