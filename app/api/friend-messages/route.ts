import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FriendshipMessage } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const friendshipId = searchParams.get("friendshipId");
    const messageId = searchParams.get("messageId");

    if (!friendshipId) {
      return new NextResponse("Friendship not found", { status: 404 });
    }

    const count = await db.friendshipMessage.count({
      where: {
        conversationId: friendshipId as string,
      },
    });

    const messageAmount = 10;

    let messageLookedAt: any;

    if (messageId) {
      messageLookedAt = await db.friendshipMessage.findFirst({
        where: {
          id: messageId as string,
          conversationId: friendshipId as string,
        },
      });
    }

    let messages: FriendshipMessage[] = [];

    if (messageLookedAt) {
      messages = await db.friendshipMessage.findMany({
        where: {
          conversationId: friendshipId as string,
          createdAt: {
            gte: messageLookedAt.createdAt,
          },
        },
        include: {
          friend: true,
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
      messages = await db.friendshipMessage.findMany({
        take: messageAmount,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: friendshipId as string,
        },
        include: {
          friend: true,
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
      messages = await db.friendshipMessage.findMany({
        take: messageAmount,
        where: {
          conversationId: friendshipId as string,
        },
        include: {
          friend: true,
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

    if (messages.length !== count - 1) {
      const allMessages = await db.friendshipMessage.findMany({
        where: {
          conversationId: friendshipId as string,
          createdAt: {
            gte: messages[messages.length - 1].createdAt,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (allMessages.length !== count) {
        nextCursor = messages[messages.length - 1].id;
      } else {
        nextCursor = null;
      }
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[MESSAGES_BETWEEN_FRIENDS_GET_ERROR]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}
