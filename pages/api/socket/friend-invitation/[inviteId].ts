import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";
import { FriendInvitationStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === "POST") {
    try {
      const profile = await currentProfileForPages(req);

      if (!profile) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { inviteId } = req.query;

      const { status }: { status: FriendInvitationStatus } = req.body;

      if (!inviteId) {
        return res.status(400).json({ message: "Invalid invite id" });
      }

      const invitation = await db.friendInvitation.findFirst({
        where: {
          id: inviteId as string,
        },
      });

      if (!invitation) {
        return res.status(400).json({ message: "Invalid invite id" });
      }

      if (status === "DECLINED") {
        const fInvitation = await db.friendInvitation.delete({
          where: {
            id: inviteId as string,
            OR: [
              {
                senderId: profile.id,
              },
              {
                receiverId: profile.id,
              },
            ],
          },
        });

        const invitationResponse = `navigation:${fInvitation.id}:invitationResponse`;

        res?.socket?.server?.io?.emit(invitationResponse, "new msg");

        return res.status(200).json(fInvitation);
      }

      if (status === "ACCEPTED") {
        const fInvitation = await db.friendInvitation.update({
          where: {
            id: inviteId as string,
          },
          data: {
            status: status as FriendInvitationStatus,
          },
        });

        const newFriend = await db.friendship.create({
          data: {
            friendOneId: invitation.senderId,
            friendTwoId: invitation.receiverId,
          },
        });

        const invitationResponse = `navigation:${fInvitation.id}:invitationResponse`;

        res?.socket?.server?.io?.emit(invitationResponse, "new msg");

        return res.status(200).json(newFriend);
      }

      return res.status(400).json({ message: "Invalid status" });
    } catch (error) {
      console.log("Friend invitation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
