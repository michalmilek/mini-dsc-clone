import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: { friendshipId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.friendshipId) {
      return new NextResponse("Invalid friendshipId", { status: 400 });
    }

    const friendship = await db.conversationBetweenFriends.findFirst({
      where: {
        id: params.friendshipId,
        OR: [
          {
            friendOneId: profile.id,
          },
          {
            friendTwoId: profile.id,
          },
        ],
      },
    });

    if (!friendship) {
      return new NextResponse("Friendship not found", { status: 404 });
    }

    await db.friendInvitation.deleteMany({
      where: {
        OR: [
          {
            senderId: friendship.friendOneId,
            receiverId: friendship.friendTwoId,
          },
          {
            senderId: friendship.friendTwoId,
            receiverId: friendship.friendOneId,
          },
        ],
      },
    });

    const deleteFriendship = await db.conversationBetweenFriends.delete({
      where: {
        id: friendship.id,
      },
    });

    return NextResponse.json(deleteFriendship);
  } catch (error) {}
}
