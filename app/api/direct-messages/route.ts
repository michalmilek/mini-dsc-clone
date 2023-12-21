import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationid = searchParams.get("conversationId");

    const messageAmount = 10;

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: messageAmount,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationid as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          reactions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: messageAmount,
        where: {
          conversationId: conversationid as string,
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

    if (messages.length === messageAmount) {
      nextCursor = messages[messageAmount - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[MESSAGES_GET_ERROR]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
