import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    const messageId = searchParams.get("messageId");

    if (!channelId) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const count = await db.message.count({
      where: {
        channelId: channelId,
      },
    });

    const messageAmount = 10;

    let messageLookedAt: any;

    if (messageId) {
      messageLookedAt = await db.message.findFirst({
        where: {
          id: messageId as string,
        },
      });
    }

    let messages: Message[] = [];

    if (messageLookedAt) {
      messages = await db.message.findMany({
        where: {
          channelId: channelId as string,
          createdAt: {
            gte: messageLookedAt.createdAt,
          },
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          reactions: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (cursor) {
      messages = await db.message.findMany({
        take: messageAmount,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId: channelId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          reactions: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: messageAmount,
        where: {
          channelId: channelId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          reactions: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length !== count) {
      const allMessages = await db.message.findMany({
        where: {
          channelId: channelId as string,
          createdAt: {
            gt: messages[messages.length - 1].createdAt,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (allMessages.length !== count - 1) {
        nextCursor = messages[messages.length - 1].id;
      } else {
        nextCursor = null;
      }
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[MESSAGES_GET_ERROR]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
