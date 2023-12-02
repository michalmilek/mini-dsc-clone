"use client";

import { Channel } from "@prisma/client";
import { Bell, Hash, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { MemberChat } from "@/app/types/server";
import { useSocket } from "@/components/providers/socket-provider";
import { SocketIndicator } from "@/components/socket-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Props {
  type: "conversation" | "channel";
  channel?: Channel;
  member?: MemberChat;
}

const ServerHeader = ({ channel, type, member }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <header className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center gap-2">
              {type === "channel" ? (
                <Hash />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={member?.profile.imageUrl}
                    alt={member?.profile.name}
                  />
                  <AvatarFallback>
                    {type === "channel" ? channel?.name : member?.profile.name}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="text-gray-700 dark:text-gray-300 mr-3">
                {type === "channel" ? channel?.name : member?.profile.name}
              </span>
            </div>
            <span className="text-lg  text-gray-600 dark:text-gray-400">
              {type === "channel" ? channel?.type : member?.role}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg  text-gray-600 dark:text-gray-400">
            Created at:{" "}
            {type === "channel"
              ? channel?.createdAt.toLocaleDateString()
              : member?.createdAt.toLocaleDateString()}
          </span>
          <Button type="button">
            <Search />
          </Button>
          <Button type="button">
            <Bell />
          </Button>
          <SocketIndicator />
        </div>
      </div>
    </header>
  );
};

export default ServerHeader;
