"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const getServers = async () => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("You must be logged in to do that");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return servers || [];
};
