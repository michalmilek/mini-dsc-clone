"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const getServer = async (serverId: string) => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("You must be logged in to view this page");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return server;
};
