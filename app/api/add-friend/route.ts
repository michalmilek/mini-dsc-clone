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
      if (invitation.status === "DECLINED") {
        return new NextResponse("You're on invited user blacklist.", {
          status: 200,
        });
      }

      return new NextResponse("Friend invitation already exists", {
        status: 400,
      });
    }

    const newFriend = await db.friendInvitation.create({
      data: {
        senderId: profile.id,
        receiverId: user.id,
      },
    });

    return NextResponse.json(newFriend);
  } catch (error) {
    console.log("Error in add-friend route: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
