import { redirect } from "next/navigation";

import NavigationSidebarMobile from "@/components/navigation/navigation-sidebar-mobile";
import ServerDropdown from "@/components/server/server-dropdown";
import ServerPageChannel from "@/components/server/server-page-channel";
import ServerPageMember from "@/components/server/server-page-member";
import NoMembers from "@/components/utility/no-members";
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
                  <ServerPageChannel
                    channel={channel}
                    key={channel.id + "server page list"}
                  />
                ))}
            </ul>
          </div>
        )}
        {server && (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h3 className="text-xl">Members</h3>
            <ul className="w-full h-full p-3">
              {membersWithoutMe && membersWithoutMe.length === 0 && (
                <NoMembers server={server} />
              )}
              {membersWithoutMe &&
                membersWithoutMe.length > 0 &&
                membersWithoutMe.map((member) => (
                  <ServerPageMember
                    member={member}
                    key={member.id + "Server page member"}
                  />
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerIdPage;
