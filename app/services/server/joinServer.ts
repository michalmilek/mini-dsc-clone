"use server";

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export const joinServer = async (serverCode: string) => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("Unauthorized");
  }

  if (!serverCode) {
    throw new Error("No server code provided");
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: serverCode,
    },
    include: {
      members: true,
    },
  });

  if (!server) {
    throw new Error("No server found with this invitation code");
  }

  if (server.members.find((member) => member.profileId === profile.id)) {
    throw new Error("You are already a member of this server");
  }

  await db.server.update({
    where: {
      id: server.id,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });
};
