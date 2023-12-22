import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === "POST") {
    try {
      const profile = await currentProfileForPages(req);
      if (!profile) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { messageId, reaction, conversationId: friendshipId } = req.body;

      if (!friendshipId) {
        return res.status(400).json({ message: "Invalid friendshipId" });
      }

      if (!messageId) {
        return res.status(400).json({ message: "Invalid messageId" });
      }

      if (!reaction) {
        return res.status(400).json({ message: "Invalid reaction" });
      }

      const friendship = await db.friendship.findFirst({
        where: {
          id: friendshipId as string,
          OR: [
            {
              friendOneId: profile.id,
            },
            {
              friendOneId: profile.id,
            },
          ],
        },
      });

      if (!friendship) {
        return res.status(400).json({ message: "Invalid friendship" });
      }

      const message = await db.friendshipMessage.findFirst({
        where: {
          id: messageId as string,
          conversationId: friendship.id,
        },
      });

      if (!message) {
        return res.status(400).json({ message: "Invalid message" });
      }

      const reactionExists = await db.reactionToFriendshipMessage.findFirst({
        where: {
          friendshipMessageId: message.id,
          profileId: profile.id,
        },
      });

      if (reactionExists) {
        await db.reactionToFriendshipMessage.update({
          data: {
            emoji: reaction as string,
            friendshipMessageId: message.id,
            profileId: profile.id,
          },
          where: {
            id: reactionExists.id,
          },
        });

        const conversationMessageReactionKey = `chat:${friendship.id}:reaction:new`;

        res?.socket?.server?.io?.emit(
          conversationMessageReactionKey,
          "server message reaction"
        );

        return res.status(200).json(conversationMessageReactionKey);
      }

      await db.reactionToFriendshipMessage.create({
        data: {
          emoji: reaction as string,
          friendshipMessageId: message.id,
          profileId: profile.id,
        },
      });

      const conversationMessageReactionKey = `chat:${friendship.id}:reaction:new`;

      res?.socket?.server?.io?.emit(
        conversationMessageReactionKey,
        "server message reaction"
      );

      return res.status(200).json(conversationMessageReactionKey);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
