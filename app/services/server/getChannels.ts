"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const getChannels = async (serverId: string) => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("You must be logged in to do that");
  }

  const channels = await db.channel.findMany({
    where: {
      serverId,
      server: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    },
  });

  return channels || [];
};
