import { redirect } from "next/navigation";

import MainPageFriendship from "@/components/main-page/main-page-friendship";
import MainPageServer from "@/components/main-page/main-page-server";
import NavigationSidebarMobile from "@/components/navigation/navigation-sidebar-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

const page = async () => {
  const profile = await initialProfile();
  if (!profile) {
    return redirect("/sign-up");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      profile: true,
      channels: true,
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

  return (
    <div className="flex w-full h-full items-center pl-32">
      <NavigationSidebarMobile />

      <ScrollArea className="w-full">
        {servers.length === 0 && friends.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-full pt-4 ">
            <h2 className="text-2xl font-bold">Welcome to Discord</h2>
            <p className="text-lg">
              You don&apos;t have any servers or friends yet.
            </p>
          </div>
        )}
        <div className="flex w-full h-full flex-col items-center justify-center pt-4">
          {servers && servers.length > 0 && (
            <h2 className="font-bold text-lg">Servers</h2>
          )}
          <ul className="w-full h-full p-3">
            {servers &&
              servers.length > 0 &&
              servers.map((server) => (
                <MainPageServer
                  server={server}
                  key={server.id + "main page server"}
                />
              ))}
          </ul>
          {friends && friends.length > 0 && (
            <>
              <h2 className="font-bold text-lg">Friends</h2>
              <ul className="w-full h-full p-3">
                {friends.map((friendship) => {
                  const friend =
                    friendship.friendOneId === profile.id
                      ? friendship.friendTwo
                      : friendship.friendOne;

                  return (
                    <MainPageFriendship
                      friend={friend}
                      friendshipId={friendship.id}
                      amountOfUnreadMessages={
                        friendship.directMessagesBetweenFriends.length
                      }
                      key={friendship.id + "main page friendship"}
                    />
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default page;
