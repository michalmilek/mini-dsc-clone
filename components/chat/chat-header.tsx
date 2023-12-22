"use client";

import { Bell, Hash, Phone, Search, Video } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";
import { MemberChat } from "@/app/types/server";
import { SocketIndicator } from "@/components/socket-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Channel } from "@prisma/client";

interface Props {
  type: "conversation" | "channel";
  channel?: Channel;
  member?: MemberChat;
}

const ChatHeader = ({ channel, type, member }: Props) => {
  const { onOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  console.log("🚀 ~ params:", params);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <header className="flex-1 p:2 sm:p-6 justify-between flex flex-col border-b-2 border-gray-200">
      <div className="flex sm:items-center justify-between py-3 ">
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
                  <AvatarFallback>{member?.profile.name}</AvatarFallback>
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
          {type === "conversation" && (
            <>
              <Button
                onClick={() =>
                  onOpen("calls", {
                    callData: {
                      audio: true,
                      video: false,
                    },
                  })
                }
                type="button">
                <Phone />
              </Button>
              <Button
                onClick={() =>
                  onOpen("calls", {
                    callData: {
                      audio: true,
                      video: true,
                    },
                  })
                }
                type="button">
                <Video />
              </Button>
            </>
          )}
          <Button
            onClick={() =>
              onOpen("findMessage", {
                chatId: params?.channelId as string,
              })
            }
            type="button">
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

export default ChatHeader;
