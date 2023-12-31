"use client";

import { MoreHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  WindowScroller,
} from "react-virtualized";

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
import ChatMessagesSkeleton from "@/components/utility/chat-messages-skeleton";
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

export const ChatFriendMessages = ({
  name,
  member,
  chatId,
  socketUrl,
  socketQuery,
  type,
  myId,
}: Props) => {
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const listRef = useRef<List>(null);
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
    isLoading,
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
        listRef.current?.scrollToRow(-1);
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
    if (!inView || !hasNextPage) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView]);

  useEffect(() => {
    if (isSent) {
      listRef.current?.scrollToRow(-1);
      setSentFalse();
    }
  }, [isSent, setSentFalse]);

  const flattenedMessages = useMemo(
    () => [
      "empty",
      ...(data?.pages
        .flatMap((page) => page.items)
        .slice()
        .reverse() || []),
    ],
    [data?.pages]
  );

  if (isLoading) {
    return <ChatMessagesSkeleton />;
  }

  if (!data) {
    return null;
  }

  if (!flattenedMessages) {
    return null;
  }

  return (
    <div className="h-full w-full">
      {flattenedMessages && (
        <div
          id="messages"
          className="h-full w-full">
          <WindowScroller>
            {() => {
              return (
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      ref={listRef}
                      width={width}
                      height={height}
                      rowHeight={cache.current.rowHeight}
                      deferredMeasurementCache={cache.current}
                      rowCount={flattenedMessages.length}
                      className="w-full px-2"
                      rowRenderer={({ key, index, style, parent }) => {
                        if (!hasNextPage && index === 0) {
                          return (
                            <div
                              key={key + "test" + "messages"}
                              style={style}>
                              <ChatWelcome
                                name={name}
                                type={type}
                              />
                            </div>
                          );
                        }

                        if (hasNextPage && index === 0) {
                          return (
                            <div
                              key={key + "test" + "messages"}
                              style={style}>
                              {isFetchingNextPage && (
                                <div className="py-1">
                                  <ChatLoader />
                                </div>
                              )}
                              <button
                                ref={ref}
                                onClick={() => fetchNextPage()}
                                className="w-full flex items-center justify-center">
                                <MoreHorizontal size={40} />
                              </button>
                            </div>
                          );
                        }

                        let item = flattenedMessages[index];

                        return (
                          <>
                            <div
                              key={key + item.id + "messages"}
                              style={style}>
                              <CellMeasurer
                                key={key + item.id + "messages"}
                                cache={cache.current}
                                parent={parent}
                                columnIndex={0}
                                rowIndex={index}>
                                <ChatFriendMessage
                                  socketUrl={socketUrl}
                                  chatId={chatId}
                                  socketQuery={socketQuery}
                                  key={item.id + "messages"}
                                  message={item}
                                  member={member}
                                  isSelf={myId === item.friendId}
                                />
                              </CellMeasurer>
                            </div>
                          </>
                        );
                      }}
                    />
                  )}
                </AutoSizer>
              );
            }}
          </WindowScroller>
        </div>
      )}
    </div>
  );
};
