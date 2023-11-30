import ServerHeader from "@/components/server/server-header";
import { db } from "@/lib/db";
import React from "react";

const ChannelIdPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const { channelId } = params;

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    return null;
  }

  return (
    <div>
      <ServerHeader channel={channel} />
    </div>
  );
};

export default ChannelIdPage;
