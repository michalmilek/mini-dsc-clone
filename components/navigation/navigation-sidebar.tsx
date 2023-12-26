import { redirect } from "next/navigation";
import React from "react";

import NavigationFriend from "@/components/navigation/navigation-friend";
import NavigationInvitation from "@/components/navigation/navigation-invitation";
import NavigationInviteFriend from "@/components/navigation/navigation-invite-friend";
import NavigationJoinServer from "@/components/navigation/navigation-join-server";
import NavigationServerInvitation from "@/components/navigation/navigation-server-invitation";
import NavigationUpdateChecker from "@/components/navigation/navigation-update-checker";
import ProfileSettings from "@/components/profile/profile-settings";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

import { ModeToggle } from "../mode-toggle";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import NavigationAdd from "./navigation-add";
import NavigationItem from "./navigation-item";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  const invitations = await db.friendInvitation.findMany({
    where: {
      receiverId: profile.id,
      status: "PENDING",
    },
    include: {
      sender: true,
    },
  });

  const allInvitations = await db.friendInvitation.findMany({
    where: {
      OR: [
        {
          senderId: profile.id,
        },
        {
          receiverId: profile.id,
        },
      ],
    },
  });

  const friends = await db.friendship.findMany({
    where: {
      OR: [
        {
          friendOneId: profile.id,
        },
        {
          friendTwoId: profile.id,
        },
      ],
    },
    include: {
      friendOne: true,
      friendTwo: true,
      directMessagesBetweenFriends: {
        where: {
          seen: false,
          NOT: {
            friendId: profile.id,
          },
        },
      },
    },
  });

  const hasDirectMessages = friends.some(
    (item) => item.directMessagesBetweenFriends.length > 0
  );

  const serverInvitations = await db.serverInvitation.findMany({
    where: {
      receiverId: profile.id,
      status: "PENDING",
    },
    include: {
      server: true,
    },
  });

  const blacklist = await db.friendInvitation.findMany({
    where: {
      senderId: profile.id,
      status: "DECLINED",
    },
    include: {
      receiver: true,
    },
  });
  const receivers = blacklist.map((item) => item.receiver);

  return (
    <>
      {hasDirectMessages && <title>Mini DSC - new messages</title>}
      <aside className="fixed inset-y-0 left-0 flex flex-col justify-between  items-center py-3 bg-white dark:bg-black shadow w-32 z-30">
        <div className="flex flex-col w-full">
          <div className="space-y-3">
            <NavigationAdd label="Create server" />

            <div className="flex-1">
              <ScrollArea className="max-h-[500px]">
                <ul className="pt-2 pb-4 space-y-1 text-sm flex flex-col items-center justify-center w-full">
                  {servers.map((item, index) => (
                    <React.Fragment key={item.id + " server"}>
                      <NavigationItem server={item} />
                      {index !== servers.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="flex flex-col w-full items-center justify-center gap-2">
              <NavigationJoinServer />
              <NavigationInviteFriend />
              {serverInvitations.length > 0 && (
                <ScrollArea className="max-h-[500px] mt-4 w-full">
                  <p className="text-lg font-bold text-center">
                    Server Invitations
                  </p>
                  <ul className="pt-2 pb-4 space-y-1 text-sm flex flex-col items-center justify-center w-full">
                    {serverInvitations.map((item, index) => (
                      <React.Fragment key={item.id + " profile"}>
                        <NavigationServerInvitation serverInvitation={item} />
                        {index !== servers.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </ul>
                </ScrollArea>
              )}
              {invitations.length > 0 && (
                <ScrollArea className="max-h-[500px] mt-4">
                  <p className="text-lg font-bold text-center">
                    Friend Invitations
                  </p>
                  <ul className="pt-2 pb-4 space-y-1 text-sm flex flex-col items-center justify-center w-full">
                    {invitations.map((item, index) => (
                      <React.Fragment key={item.id + " profile"}>
                        <NavigationInvitation invitation={item} />
                        {index !== servers.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </ul>
                </ScrollArea>
              )}

              {friends.length > 0 && (
                <ScrollArea className="max-h-[500px] mt-4">
                  <p className="text-lg font-bold text-center">Friends</p>
                  <ul className="pt-2 pb-4 space-y-1 text-sm flex flex-col items-center justify-center w-full">
                    {friends.map((item, index) => (
                      <React.Fragment key={item.id + " profile"}>
                        <NavigationFriend friendship={item} />
                        {index !== servers.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
            <NavigationUpdateChecker
              id={profile.id}
              allInvitations={allInvitations}
              friends={friends}
            />
          </div>
        </div>

        <div className="flex items-center justify-center flex-col space-y-3">
          <ProfileSettings blacklist={receivers} />
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
