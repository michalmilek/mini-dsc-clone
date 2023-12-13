import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { FriendInvitationStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { inviteId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { inviteId } = params;

    const { status } = await req.json();

    if (!inviteId) {
      return new NextResponse("Invalid invite id", { status: 400 });
    }

    const invitation = await db.friendInvitation.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invitation) {
      return new NextResponse("Invalid invite id", { status: 400 });
    }

    await db.friendInvitation.update({
      where: {
        id: inviteId,
      },
      data: {
        status: status as FriendInvitationStatus,
      },
    });

    const newFriend = await db.conversationBetweenFriends.create({
      data: {
        friendOneId: invitation.senderId,
        friendTwoId: invitation.receiverId,
      },
    });

    return NextResponse.json(newFriend);
  } catch (error) {}
}
