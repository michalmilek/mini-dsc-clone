import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

import ServerChannelsList from "@/components/server/server-channels-list";
import ServerDropdown from "@/components/server/server-dropdown";
import ServerSearch from "@/components/server/server-search";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const iconMap = {
  [ChannelType.TEXT]: <Hash />,
  [ChannelType.AUDIO]: <Mic />,
  [ChannelType.VIDEO]: <Video />,
};

const iconRoleMap = {
  [MemberRole.GUEST]: <User />,
  [MemberRole.ADMIN]: <ShieldAlert />,
  [MemberRole.MODERATOR]: <ShieldCheck />,
};

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
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

  if (!server) {
    return redirect("/");
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === "TEXT"
  );
  const audioChnanels = server.channels.filter(
    (channel) => channel.type === "AUDIO"
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === "VIDEO"
  );

  const members = server.members.filter((member) => member.id !== profile.id);

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="h-full pl-32 w-full">
      <nav className="hidden fixed md:flex h-full w-60 z-20 flex-col inset-y-0 bg-gray-200 dark:bg-gray-700 shadow-xl p-3 gap-4">
        <ServerDropdown
          server={server}
          members={members}
          name={server.name}
          role={role}
        />
        <ServerSearch
          data={[
            {
              label: "Text channels",
              type: "channel",
              data: textChannels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Voice channels",
              type: "channel",
              data: audioChnanels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Video channels",
              type: "channel",
              data: videoChannels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Members",
              type: "member",
              data: members.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: iconRoleMap[member.role],
              })),
            },
          ]}
        />
        <Separator />
        <ServerChannelsList
          label="Text channels"
          channelType="TEXT"
          role={role}
          sectionType="channels"
          server={server}
        />
      </nav>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
