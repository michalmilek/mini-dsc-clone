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

      const { serverId, messageId, reaction } = req.body;

      if (!serverId) {
        return res.status(400).json({ message: "Invalid serverId" });
      }

      if (!messageId) {
        return res.status(400).json({ message: "Invalid messageId" });
      }

      if (!reaction) {
        return res.status(400).json({ message: "Invalid reaction" });
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
        },
      });

      if (!server) {
        return res.status(400).json({ message: "Invalid server" });
      }

      const channels = server.channels;

      const message = await db.message.findFirst({
        where: {
          id: messageId as string,
          channelId: {
            in: channels.map((channel) => channel.id),
          },
        },
      });

      if (!message) {
        return res.status(400).json({ message: "Invalid message" });
      }

      const reactionExists = await db.reaction.findFirst({
        where: {
          messageId: message.id,
          profileId: profile.id,
        },
      });

      if (reactionExists) {
        await db.reaction.update({
          data: {
            emoji: reaction as string,
            messageId: message.id,
            profileId: profile.id,
          },
          where: {
            id: reactionExists.id,
          },
        });

        const channelMessageReactionKey = `chat:${message.channelId}:reaction:new`;

        res?.socket?.server?.io?.emit(
          channelMessageReactionKey,
          "server message reaction"
        );

        return res.status(200).json(channelMessageReactionKey);
      }

      await db.reaction.create({
        data: {
          emoji: reaction as string,
          messageId: message.id,
          profileId: profile.id,
        },
      });

      const channelMessageReactionKey = `chat:${message.channelId}:reaction:new`;

      res?.socket?.server?.io?.emit(
        channelMessageReactionKey,
        "server message reaction"
      );

      return res.status(200).json(channelMessageReactionKey);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
