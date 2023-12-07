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
    console.log("🚀 ~ profile:", profile);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "ConversationId missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
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

    const message = await db.directMessage.create({
      data: {
        content: content as string,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, "new msg");

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST_SOCKET]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
