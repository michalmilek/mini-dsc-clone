"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { $Enums, Server } from "@prisma/client";
import {
  ArrowDown,
  Plus,
  Settings,
  Trash,
  User,
  UserPlus,
  X,
} from "lucide-react";

interface Props {
  server: Server;
  role?: $Enums.MemberRole;
  members: ({
    profile: {
      id: string;
      userId: string;
      name: string;
      imageUrl: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
  } & {
    id: string;
    role: $Enums.MemberRole;
    profileId: string;
    serverId: string;
    createdAt: Date;
    updatedAt: Date;
  })[];
  name: string;
}

import React from "react";
import { Button } from "../ui/button";
import { useModal } from "@/app/hooks/use-modal-store";

const ServerDropdown = ({ role, members, name, server }: Props) => {
  const { onOpen } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-bold flex items-center w-full justify-center">
        <Button variant={"default"}>Server Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(role === "ADMIN" || role === "MODERATOR") && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("invite", { server })}
              className="w-full flex justify-between items-center gap-3 text-indigo-700 dark:text-indigo-400">
              Invite People <UserPlus />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("editServer", { server })}
              className="w-full flex justify-between items-center gap-3">
              Server settings <Settings />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("members", { server })}
              className="w-full flex justify-between items-center gap-3">
              Menage members <User />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onOpen("createChannel", { server })}
              className="w-full flex justify-between items-center gap-3">
              Create channel <Plus />
            </DropdownMenuItem>
          </>
        )}
        {(role === "MODERATOR" || role === "GUEST") && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="w-full flex justify-between items-center gap-3">
            Leave channel <X />
          </DropdownMenuItem>
        )}
        {role === "ADMIN" && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="w-full flex justify-between items-center gap-3">
            Delete server <Trash />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerDropdown;
