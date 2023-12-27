import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getIconByType } from "@/app/utils/get-icon-by-type";
import NavigationSidebarMobile from "@/components/navigation/navigation-sidebar-mobile";
import ServerDropdown from "@/components/server/server-dropdown";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const ServerIdPage = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findFirst({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: true,
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  const me = server?.members.find((member) => member.profileId === profile.id);

  const membersWithoutMe = server?.members.filter(
    (member) => member.profile.id !== profile.id
  );

  return (
    <div>
      <NavigationSidebarMobile />
      <div className="flex flex-col items-center pl-32 sm:pl-0 justify-center w-full h-full">
        {!server && <div className="text-2xl">Server not found</div>}
        {server && (
          <div className="flex flex-col items-center justify-start gap-3 w-full h-full p-3 ">
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">
              <h2 className="text-2xl font-bold">{server.name}</h2>
              <div className="block md:hidden">
                <ServerDropdown
                  role={me?.role}
                  server={server}
                  members={server.members}
                  name={server.name}
                />
              </div>
              <h3 className="text-xl">Channels</h3>
            </div>
            <ul className="w-full h-full p-3">
              {server.channels.length > 0 &&
                server.channels.map((channel) => (
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
          </div>
        )}
        {server && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h3 className="text-xl">Members</h3>
            <ul className="w-full h-full p-3">
              {membersWithoutMe &&
                membersWithoutMe.length > 0 &&
                membersWithoutMe.map((member) => (
                  <li
                    className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2"
                    key={member.id + "mobile menu"}>
                    <Link
                      href={`/servers/${server.id}/conversations/${member.profile.id}`}
                      className="w-full h-full">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            fill
                            alt={member.profile.name}
                            src={member.profile.imageUrl}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {member.profile.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {member.role}
                          </p>
                        </div>
                        <div className="hidden items-center text-base text-gray-900 dark:text-white xs:inline-flex">
                          {format(
                            new Date(member.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerIdPage;
