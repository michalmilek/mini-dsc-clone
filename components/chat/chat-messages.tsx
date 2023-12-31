"use client";

import { MoreHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { animateScroll as scroll } from "react-scroll";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  WindowScroller,
} from "react-virtualized";

import { useChatSocket } from "@/app/hooks/use-chat-socket";
import { useSendMessageHook } from "@/app/hooks/use-send-message";
import { useGetMessages } from "@/app/services/chat/getMessages";
import ChatLoader from "@/components/chat/chat-loader";
import ChatMessage from "@/components/chat/chat-message";
import { ChatWelcome } from "@/components/chat/chat-welcome";
import ChatMessagesSkeleton from "@/components/utility/chat-messages-skeleton";
import { Member } from "@prisma/client";

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

export const ChatMessages = ({
  name,
  member,
  chatId,
  socketUrl,
  socketQuery,
  type,
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

  const { setSentFalse, isSent } = useSendMessageHook();

  const searchParams = useSearchParams();
  const messageId = searchParams?.get("messageId");

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchedAfterMount,
    isLoading,
  } = useGetMessages({
    chatId,
    messageId: messageId ? messageId : "",
  });

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
    if (isFetchedAfterMount && !messageId) {
      setTimeout(() => {
        listRef.current?.scrollToRow(-1);
      }, 2000);
    }
  }, [isFetchedAfterMount, messageId]);

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
    <div className="w-full h-full">
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
                                  <ChatMessage
                                    type={type}
                                    socketUrl={socketUrl}
                                    chatId={chatId}
                                    socketQuery={socketQuery}
                                    key={item.id + "messages"}
                                    message={item}
                                    member={member}
                                    isSelf={item.memberId === member.id}
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
    </div>
  );
};
