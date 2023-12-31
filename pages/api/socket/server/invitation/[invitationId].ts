import { NextApiRequest } from 'next';

import { currentProfileForPages } from '@/lib/current-profile-for-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIo } from '@/types/types';
import { FriendInvitationStatus } from '@prisma/client';

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

      const { status } = req.body;

      if (!inviteId) {
        return res.status(400).json({ message: "Invalid invite id" });
      }

      const invitation = await db.serverInvitation.findFirst({
        where: {
          id: inviteId as string,
        },
      });

      if (!invitation) {
        return res.status(400).json({ message: "Invalid invite id" });
      }

      const sInvitation = await db.serverInvitation.update({
        where: {
          id: inviteId as string,
        },
        data: {
          status: status as FriendInvitationStatus,
        },
      });

      if (!sInvitation) {
        return res.status(400).json({ message: "Invalid invite id" });
      }

      const newFriend = await db.server.update({
        where: {
          id: invitation.serverId,
        },
        data: {
          members: {
            create: {
              profileId: invitation.receiverId,
            },
          },
        },
      });

      const serverInvitationKey = `navigation:${sInvitation.receiverId}/:${sInvitation.senderId}:serverInvitationKey`;

      res?.socket?.server?.io?.emit(serverInvitationKey, "new inv");

      return res.status(200).json(newFriend);
    } catch (error) {
      console.log("Friend invitation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const profile = await currentProfileForPages(req);

      if (!profile) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { inviteId } = req.query;

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

      await db.serverInvitation.delete({
        where: {
          id: inviteId as string,
        },
      });

      return res
        .status(200)
        .json({ message: "Invitation deleted successfully" });
    } catch (error) {
      console.log("Friend invitation deletion error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
