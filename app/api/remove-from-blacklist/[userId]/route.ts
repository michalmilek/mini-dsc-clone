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
        status: "DECLINED",
      },
    });

    if (!invitation) {
      return new NextResponse("Friend isnt blocked", { status: 404 });
    }

    await db.friendInvitation.delete({
      where: {
        id: invitation.id,
      },
    });

    return NextResponse.json({ message: `${user.name} has been unblocked` });
  } catch (error) {
    console.log("Error in block-friend route: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
