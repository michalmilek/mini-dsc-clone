import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Invalid email", { status: 400 });
    }

    const user = await db.profile.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const invitation = await db.friendInvitation.findFirst({
      where: {
        OR: [
          {
            senderId: profile.id,
            receiverId: user.id,
          },
          {
            senderId: user.id,
            receiverId: profile.id,
          },
        ],
      },
    });

    if (invitation) {
      await db.friendInvitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "DECLINED",
        },
      });
    }

    await db.friendInvitation.create({
      data: {
        senderId: profile.id,
        receiverId: user.id,
        status: "DECLINED",
      },
    });

    const friendship = await db.conversationBetweenFriends.findFirst({
      where: {
        OR: [
          {
            friendOneId: profile.id,
            friendTwoId: user.id,
          },
          {
            friendOneId: user.id,
            friendTwoId: profile.id,
          },
        ],
      },
    });

    if (friendship) {
      await db.conversationBetweenFriends.delete({
        where: {
          id: friendship.id,
        },
      });
    }

    return NextResponse.json({ message: "User has been blocked" });
  } catch (error) {
    console.log("Error in block-friend route: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
