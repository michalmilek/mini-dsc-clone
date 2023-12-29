"use client";

import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import useAsync from "@/app/hooks/use-async";
import { getServer } from "@/app/services/server/getServer";
import ServerChannelsList from "@/components/server/server-channels-list";
import ServerDropdown from "@/components/server/server-dropdown";
import ServerSearch from "@/components/server/server-search";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";

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

const ServerIdTemplate = ({
  children,
  serverId,
}: {
  children: React.ReactNode;
  serverId: string;
}) => {
  console.log("🚀 ~ serverId:", serverId);
  const params = useParams();
  const { value: server, execute } = useAsync(getServer);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (params?.serverId) {
      execute(params.serverId);
    }
  }, [params?.serverId, execute]);

  if (!params?.serverId) {
    return <div>No serverIDfdsfds</div>;
  }

  if (!server) {
    return <div>Server not found</div>;
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

  const members = server.members.filter(
    (member) => member.profile.imageUrl !== user?.imageUrl
  );

  const member = server.members.find(
    (member) => member.profile.imageUrl === user?.imageUrl
  );

  if (!member) {
    return <div>Member not found</div>;
  }

  const role = member?.role;

  return (
    <div className="h-full pl-0 sm:pl-32 w-full">
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
          role={role}
          server={server}
          profileId={member?.profile.email}
        />
      </nav>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdTemplate;
