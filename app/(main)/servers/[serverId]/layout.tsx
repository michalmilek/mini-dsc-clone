import ServerDropdown from "@/components/server/server-dropdown";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

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
  console.log("🚀 ~ role:", role);

  return (
    <div className="h-full pl-32 w-full">
      <nav className="hidden fixed md:flex h-full w-60 z-20 flex-col inset-y-0 bg-gray-200 dark:bg-gray-700 shadow-xl p-3">
        <ServerDropdown
          server={server}
          members={members}
          name={server.name}
          role={role}
        />
      </nav>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
