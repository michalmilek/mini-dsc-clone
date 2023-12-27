import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getIconByType } from "@/app/utils/get-icon-by-type";
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
                <li
                  className="p-2 flex flex-col gap-2"
                  key={server.id + "mobile menu"}>
                  <div>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={server.imageUrl}
                          alt={server.name}
                          fill
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-smfont-bold text-gray-900 truncate dark:text-white">
                          {server.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          Created by: {server.profile.name}
                        </p>
                      </div>
                      <div className="hidden xs:inline-flex items-center text-base text-gray-900 dark:text-white">
                        Created:{" "}
                        {format(new Date(server.createdAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    </div>
                  </div>
                  {server.channels.length > 0 && (
                    <ul className="w-full h-full p-3">
                      {server.channels.map((channel) => (
                        <li
                          className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2"
                          key={channel.id + "mobile menu"}>
                          <Link
                            href={`/servers/${server.id}/channels/${channel.id}`}
                            className="w-full h-full">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                              <div className="flex-shrink-0">
                                {getIconByType(channel.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                  {channel.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                  {channel.type}
                                </p>
                              </div>
                              <div className="hidden xs:inline-flex items-center text-base text-gray-900 dark:text-white">
                                {format(
                                  new Date(channel.createdAt),
                                  "dd/MM/yyyy HH:mm"
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
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
                    <li
                      className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2"
                      key={friendship.id + "mobile menu"}>
                      <Link
                        href={`/friendship/${friendship.id}`}
                        className="w-full h-full">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {friendship.directMessagesBetweenFriends.length >
                              0 && (
                              <span className="absolute z-10 top-0 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                                {friendship.directMessagesBetweenFriends.length}
                              </span>
                            )}
                            <Image
                              src={friend.imageUrl}
                              alt={friend.name}
                              fill
                              className="rounded-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {friend.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {friend.email}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
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
