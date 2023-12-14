import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = params;

    if (!userId) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }

    const user = await db.profile.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const invitation = await db.friendInvitation.deleteMany({
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

    if (!invitation) {
      return new NextResponse(`You arent friends with ${user.name} `, {
        status: 404,
      });
    }

    await db.conversationBetweenFriends.deleteMany({
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

    return NextResponse.json({
      message: `${user.name} is not your friend anymore`,
    });
  } catch (error) {
    console.log("Error in block-friend route: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
