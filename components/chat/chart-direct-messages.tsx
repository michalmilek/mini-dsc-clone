"use client";

import { Member } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { animateScroll as scroll } from "react-scroll";

import { useChatSocket } from "@/app/hooks/use-chat-socket";
import { useGetDirectMessages } from "@/app/services/chat/getDirectMessages";
import { MessageWithMember } from "@/app/types/server";
import ChatLoader from "@/components/chat/chat-loader";
import ChatMessage from "@/components/chat/chat-message";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

interface Response {
  items: MessageWithMember[];
  nextCursor: string | null | undefined;
}

export const ChatDirectMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetDirectMessages({
      conversationId: chatId,
    });

  const addKey = useMemo(() => `chat:${chatId}:messages`, [chatId]);
  const updateKey = useMemo(() => `chat:${chatId}:messages:update`, [chatId]);

  useChatSocket({
    addKey,
    updateKey,
    channelId: chatId,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    scroll.scrollToBottom({});
  }, [data]);

  useEffect(() => {
    if (!inView || !hasNextPage) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView]);

  const scrollToBottom = () => {
    scroll.scrollToBottom();
  };

  if (!data) {
    return null;
  }

  return (
    <ScrollArea className="h-full">
      <div className="h-full">
        {!hasNextPage && (
          <ChatWelcome
            name={name}
            type={type}
          />
        )}
        {isFetchingNextPage && (
          <div className="py-3">
            <ChatLoader />
          </div>
        )}
        {hasNextPage && <div ref={ref} />}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="w-full flex items-center justify-center">
            <MoreHorizontal size={40} />
          </button>
        )}
        {data && (
          <div
            id="messages"
            className="flex flex-col-reverse space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            {data.pages.map((page) => {
              return page.items.map((item: MessageWithMember) => (
                <ChatMessage
                  socketUrl={socketUrl}
                  chatId={chatId}
                  socketQuery={socketQuery}
                  key={item.id + "messages"}
                  message={item}
                  member={member}
                  isSelf={item.memberId === member.id}
                />
              ));
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
