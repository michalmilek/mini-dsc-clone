"use client";

import { Bell, Hash, Phone, Search, Video } from 'lucide-react';
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

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
  const router = useRouter();
  const pathname = usePathname();

  const isLargerThanMobile = useMediaQuery({
    query: "(min-width: 550px)",
  });
  const isLargerThan640 = useMediaQuery({
    query: "(min-width: 640px)",
  });
  const isLargerThan850 = useMediaQuery({
    query: "(min-width: 850px)",
  });

  const conversationId =
    type === "conversation" && params?.memberId
      ? params?.memberId
      : params?.friendshipId;

  const conversationType =
    type === "conversation" && params?.memberId
      ? "serverConversation"
      : "friendship";

  const chatType = type === "channel" ? "channel" : conversationType;

  const chatId = type === "channel" ? params?.channelId : conversationId;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <header className="flex-1 p-4 sm:p-6 justify-between flex flex-col border-b-2 border-gray-200">
      <div className="flex sm:items-center justify-between py-3 ">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight">
            <div className="text-lg md:text-2xl mt-1 flex items-center gap-2">
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
            <span className="md:text-sm text-lg text-gray-600 dark:text-gray-400">
              {type === "channel" ? channel?.type : member?.role}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isLargerThan640 ? (
            <span className="text-md md:text-lg text-gray-600 dark:text-gray-400">
              Created at:{" "}
              {type === "channel"
                ? channel?.createdAt.toLocaleDateString()
                : member?.createdAt.toLocaleDateString()}
            </span>
          ) : (
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => {
                  if (pathname) {
                    const parts = pathname.split("/");
                    const serverPath = "/" + parts.slice(1, 3).join("/");
                    router.push(serverPath);
                  }
                }}>
                Main menu
              </Button>
              <Button
                onClick={() => {
                  if (pathname) {
                    const parts = pathname.split("/");
                    const serverPath = "/" + parts.slice(1, 3).join("/");
                    router.push(serverPath);
                  }
                }}>
                Server
              </Button>
            </div>
          )}
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
            onClick={() => {
              if (chatType === "channel") {
                onOpen("findMessage", {
                  chatId: chatId as string,
                });
              } else if (chatType === "serverConversation") {
                onOpen("findDirectMessage", {
                  chatId: chatId as string,
                });
              }
            }}
            type="button">
            <Search />
          </Button>
          <Button type="button">
            <Bell />
          </Button>
          {isLargerThan850 && <SocketIndicator />}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
