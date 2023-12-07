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
    const { conversationId, directMessageId } = req.query;
    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "ConversationId missing" });
    }

    if (!directMessageId) {
      return res.status(400).json({ error: "Direct message ID missing" });
    }

    const member = await db.member.findFirst({
      where: {
        profileId: profile.id,
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOneId: member.id,
          },
          {
            memberTwoId: member.id,
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        OR: [
          {
            memberId: member.id,
          },
          {
            member: {
              OR: [
                {
                  role: "ADMIN",
                },
                {
                  role: "MODERATOR",
                },
              ],
            },
          },
        ],
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === "ADMIN";
    const isModerator = member.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "PATCH") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content: content as string,
          fileUrl,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, "update msg");

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal error" });
  }
}
