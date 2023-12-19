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

      const { serverId, receiverId } = req.body;

      if (!serverId) {
        return res.status(400).json({ message: "Invalid serverId" });
      }

      if (!receiverId) {
        return res.status(400).json({ message: "Invalid receiverId" });
      }

      const serverInvitation = await db.serverInvitation.findFirst({
        where: {
          serverId: serverId as string,
          OR: [
            {
              receiverId: profile.id,
            },
            {
              senderId: profile.id,
            },
          ],
        },
      });

      if (serverInvitation) {
        return res
          .status(400)
          .json({ message: "Server invitation already exists" });
      }

      await db.serverInvitation.createMany({
        data: {
          serverId: serverId as string,
          receiverId: receiverId as string,
          senderId: profile.id,
        },
      });

      const serverInvitationKey = `navigation:${
        serverId as string
      }:serverInvitationKey`;

      res?.socket?.server?.io?.emit(serverInvitationKey, "server invite");

      return res.status(200).json(serverInvitationKey);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
