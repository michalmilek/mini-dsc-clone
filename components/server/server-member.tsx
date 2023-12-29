"use client";

import { useRouter } from "next/navigation";

import { CustomMember } from "@/app/types/server";
import { getIconByRole } from "@/app/utils/get-icon-by-role";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MemberRole } from "@prisma/client";

const ServerMember = ({ member }: { member: CustomMember }) => {
  const router = useRouter();
  return (
    <li key={member.id + "members"}>
      <Button
        className="gap-2"
        onClick={() => {
          router.push(`/servers/${member.serverId}/conversations/${member.id}`);
        }}
        variant={"link"}>
        <Avatar>
          <AvatarImage src={member.profile.imageUrl} />
          <AvatarFallback>{member.profile.name}</AvatarFallback>
        </Avatar>
        {member.profile.name}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {getIconByRole(member.role.toUpperCase() as MemberRole)}
            </TooltipTrigger>
            <TooltipContent>
              <p>{member.role.toUpperCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Button>
    </li>
  );
};

export default ServerMember;
