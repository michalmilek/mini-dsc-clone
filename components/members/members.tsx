"use client";

import { useMemo } from "react";

import { ServerWithMembersAndChannels } from "@/app/types/server";
import { Card, CardContent } from "@/components/ui/card";

import Member from "./member";

const Members = ({ server }: { server: ServerWithMembersAndChannels }) => {
  const membersWithoutAdmin = useMemo(
    () => server.members.filter((member) => member.role !== "ADMIN"),
    [server.members]
  );
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center w-full h-full py-4">
        <div className="w-full h-full flex flex-col items-center justify-center">
          {membersWithoutAdmin.map((member) => (
            <Member
              key={"Members settings" + member.profile.name + server.id}
              memberId={member.id}
              serverId={server.id}
              email={member.profile.email}
              name={member.profile.name}
              imgSrc={member.profile.imageUrl}
              role={member.role}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Members;
