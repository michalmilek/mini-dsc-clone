import { NextApiRequest } from "next";

import { currentProfileForPages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === "DELETE") {
    try {
      const profile = await currentProfileForPages(req);
      if (!profile) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { friendshipId } = req.query;

      if (!friendshipId) {
        return res.status(400).json({ message: "Invalid friendshipId" });
      }

      const friendship = await db.friendship.findFirst({
        where: {
          id: friendshipId as string,
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
        return res.status(404).json({ message: "Friendship not found" });
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

      const deleteFriendship = await db.friendship.delete({
        where: {
          id: friendship.id,
        },
      });

      const deleteFriendshipKey = `navigation:${deleteFriendship.id}:deleteFriendship`;

      res?.socket?.server?.io?.emit(deleteFriendshipKey, "friendship remove");

      return res.status(200).json(deleteFriendship);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
