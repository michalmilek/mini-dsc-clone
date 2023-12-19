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
        if (invitation.status === "DECLINED") {
          return res
            .status(200)
            .json({ message: "You're on invited user blacklist." });
        }

        return res
          .status(400)
          .json({ message: "Friend invitation already exists" });
      }

      const newFriend = await db.friendInvitation.create({
        data: {
          senderId: profile.id,
          receiverId: user.id,
        },
      });

      const addFriendKey = `navigation:${user.id}:addFriend`;

      res?.socket?.server?.io?.emit(addFriendKey, "new msg");

      return res.status(200).json(newFriend);
    } catch (error) {
      console.log("Error in add-friend route: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
