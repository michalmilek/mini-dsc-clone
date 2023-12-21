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

      const { serverId, messageId, reaction, conversationId } = req.body;

      if (!serverId) {
        return res.status(400).json({ message: "Invalid serverId" });
      }

      if (!messageId) {
        return res.status(400).json({ message: "Invalid messageId" });
      }

      if (!reaction) {
        return res.status(400).json({ message: "Invalid reaction" });
      }

      if (!conversationId) {
        return res.status(400).json({ message: "Invalid conversationId" });
      }

      const server = await db.server.findFirst({
        where: {
          id: serverId as string,
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
        include: {
          channels: true,
          members: true,
        },
      });

      if (!server) {
        return res.status(400).json({ message: "Invalid server" });
      }

      const meMember = server.members.find(
        (member) => member.profileId === profile.id
      );

      if (!meMember) {
        return res.status(400).json({ message: "Invalid member" });
      }

      const conversation = await db.conversation.findFirst({
        where: {
          id: conversationId as string,
          OR: [
            {
              memberOneId: meMember.id,
            },
            {
              memberTwoId: meMember.id,
            },
          ],
        },
      });

      if (!conversation) {
        return res.status(400).json({ message: "Invalid conversation" });
      }

      const message = await db.directMessage.findFirst({
        where: {
          id: messageId as string,
          conversationId: conversation.id,
        },
      });

      if (!message) {
        return res.status(400).json({ message: "Invalid message" });
      }

      const reactionExists = await db.reactionToDirectMessage.findFirst({
        where: {
          directMessageId: message.id,
          profileId: profile.id,
        },
      });

      if (reactionExists) {
        await db.reactionToDirectMessage.update({
          data: {
            emoji: reaction as string,
            directMessageId: message.id,
            profileId: profile.id,
          },
          where: {
            id: reactionExists.id,
          },
        });

        const conversationMessageReactionKey = `chat:${conversation.id}:reaction:new`;

        res?.socket?.server?.io?.emit(
          conversationMessageReactionKey,
          "server message reaction"
        );

        return res.status(200).json(conversationMessageReactionKey);
      }

      await db.reactionToDirectMessage.create({
        data: {
          emoji: reaction as string,
          directMessageId: message.id,
          profileId: profile.id,
        },
      });

      const conversationMessageReactionKey = `chat:${conversation.id}:reaction:new`;

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
