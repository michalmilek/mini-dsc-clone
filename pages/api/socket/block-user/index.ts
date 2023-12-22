import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";

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

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Invalid email" });
      }

      const user = await db.profile.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
      } else {
        await db.friendInvitation.create({
          data: {
            senderId: profile.id,
            receiverId: user.id,
            status: "DECLINED",
          },
        });
      }

      const friendship = await db.friendship.findFirst({
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
        await db.friendship.delete({
          where: {
            id: friendship.id,
          },
        });
      }

      const friendshipKey = `navigation:${user.id}:blockUser`;

      res?.socket?.server?.io?.emit(friendshipKey, "friendship block");

      return res.status(200).json({ message: "User has been blocked" });
    } catch (error) {
      console.log("Error in block-friend route: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
