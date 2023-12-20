"use server";

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function serverInvitationAccept(inviteId: string) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const invitation = await db.serverInvitation.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invitation) {
      throw new Error("Invitation doesnt exist");
    }

    await db.serverInvitation.update({
      where: {
        id: inviteId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    await db.server.update({
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
  } catch (error) {
    console.log("server action accept server invite error", error);
  }
}

export async function serverInvitationReject(inviteId: string) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      throw new Error("Unauthorized");
    }

    const invitation = await db.serverInvitation.findFirst({
      where: {
        id: inviteId,
      },
    });

    if (!invitation) {
      throw new Error("Invitation doesnt exist");
    }

    await db.serverInvitation.delete({
      where: {
        id: inviteId,
      },
    });
  } catch (error) {
    console.log("server action reject server invite error", error);
  }
}
