import { ServerWithMembersAndChannels } from "@/app/types/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdPage = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile!.id,
        },
      },
    },
    include: {
      channels: true,
    },
  });
  return redirect(
    `/servers/${params.serverId}/channels/${
      (server as ServerWithMembersAndChannels)?.channels[0]?.id
    }`
  );
};

export default ServerIdPage;
