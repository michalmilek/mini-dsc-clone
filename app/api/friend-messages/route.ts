import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessageBetweenFriends } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const friendshipId = searchParams.get("friendshipId");

    const messageAmount = 10;

    let messages: DirectMessageBetweenFriends[] = [];

    if (cursor) {
      messages = await db.directMessageBetweenFriends.findMany({
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
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessageBetweenFriends.findMany({
        take: messageAmount,
        where: {
          conversationId: friendshipId as string,
        },
        include: {
          friend: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === messageAmount) {
      nextCursor = messages[messageAmount - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[MESSAGES_BETWEEN_FRIENDS_GET_ERROR]", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}
