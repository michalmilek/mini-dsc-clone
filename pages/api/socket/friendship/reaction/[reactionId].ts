import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === "DELETE") {
    try {
      const profile = await currentProfileForPages(req);
      if (!profile) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { reactionId } = req.query;

      if (!reactionId) {
        return res.status(400).json({ message: "Invalid reactionId" });
      }

      const reaction = await db.reactionToFriendshipMessage.findFirst({
        where: {
          id: reactionId as string,
          profileId: profile.id,
        },
        include: {
          friendshipMessage: true,
        },
      });

      if (!reaction) {
        return res.status(404).json({ message: "Reaction not found" });
      }

      await db.reactionToDirectMessage.delete({
        where: {
          id: reaction.id,
        },
      });

      const conversationReactionDeleteKey = `chat:${reaction.friendshipMessage.id}:reaction:delete`;

      res?.socket?.server?.io?.emit(
        conversationReactionDeleteKey,
        "server message reaction delete"
      );

      return res.status(200).json(conversationReactionDeleteKey);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
