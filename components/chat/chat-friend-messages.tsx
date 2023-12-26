"use client";

import { MoreHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { animateScroll as scroll } from "react-scroll";

import { revalidateLayout } from "@/app/actions/revalidateLayout";
import useAsync from "@/app/hooks/use-async";
import { useChatSocket } from "@/app/hooks/use-chat-socket";
import { useSendMessageHook } from "@/app/hooks/use-send-message";
import { useGetFriendMessages } from "@/app/services/chat/getFriendMessages";
import { markAsRead } from "@/app/services/chat/markAsRead";
import { MessageWithFriend } from "@/app/types/server";
import ChatFriendMessage from "@/components/chat/chat-friend-message";
import ChatLoader from "@/components/chat/chat-loader";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  name: string;
  member: Profile;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "friendshipId";
  paramValue: string;
  type: "channel" | "conversation";
  myId: string;
}

interface Response {
  items: MessageWithFriend[];
  nextCursor: string | null | undefined;
}

export const ChatFriendMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
  myId,
}: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const queryClient = useQueryClient();
  const { isSent, setSentFalse } = useSendMessageHook();
  const searchParams = useSearchParams();
  const messageId = searchParams?.get("messageId");
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isFetchedAfterMount,
  } = useGetFriendMessages({
    friendshipId: chatId,
    messageId: messageId ? messageId : "",
  });
  const { execute, status } = useAsync(markAsRead);

  const addKey = useMemo(() => `chat:${chatId}:messages`, [chatId]);
  const updateKey = useMemo(() => `chat:${chatId}:messages:update`, [chatId]);
  const reactionAddKey = useMemo(() => `chat:${chatId}:reaction:new`, [chatId]);
  const reactionDeleteKey = useMemo(
    () => `chat:${chatId}:reaction:delete`,
    [chatId]
  );

  useChatSocket({
    addKey,
    updateKey,
    channelId: chatId,
    reactionAddKey,
    reactionDeleteKey,
  });

  const hasUnseenMessage = useMemo(
    () =>
      data &&
      data.pages.some((page) =>
        page.items.some(
          (item: MessageWithFriend) =>
            item.seen === false && myId === item.friendId
        )
      ),
    [data, myId]
  );

  useEffect(() => {
    if (isFetchedAfterMount) {
      setTimeout(() => {
        const element = document.getElementById("emptyDiv");

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 2000);
    }
  }, [isFetchedAfterMount]);

  useEffect(() => {
    if (isSuccess) {
      if (hasUnseenMessage) {
        execute(chatId);
      }
    }
  }, [execute, chatId, isSuccess, hasUnseenMessage]);

  useEffect(() => {
    if (status === "success") {
      revalidateLayout();
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    }
  }, [status, chatId, queryClient]);

  useEffect(() => {
    const logOnRefetch = () => {
      execute(chatId);
    };

    window.addEventListener("focus", logOnRefetch);
    window.addEventListener("scroll", logOnRefetch);

    return () => {
      window.removeEventListener("focus", logOnRefetch);
      window.removeEventListener("scroll", logOnRefetch);
    };
  }, [chatId, execute]);

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

  useEffect(() => {
    if (isSent) {
      const element = document.getElementById("emptyDiv");

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setSentFalse();
    }
  }, [isSent, setSentFalse]);

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
              return page.items.map((item: MessageWithFriend) => (
                <ChatFriendMessage
                  socketUrl={socketUrl}
                  chatId={chatId}
                  socketQuery={socketQuery}
                  key={item.id + "messages"}
                  message={item}
                  member={member}
                  isSelf={myId === item.friendId}
                />
              ));
            })}
          </div>
        )}
      </div>
      <div id="emptyDiv" />
    </ScrollArea>
  );
};
