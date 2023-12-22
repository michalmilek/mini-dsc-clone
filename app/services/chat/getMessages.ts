import axios from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

interface GetMessageParams {
  cursor?: string;
  channelId?: string;
  messageId?: string;
}

export function useGetMessages({
  chatId,
  initialCursor = 1,
  messageId,
}: {
  chatId: string;
  initialCursor?: number;
  messageId?: string;
}) {
  const getMessages = async ({
    pageParam,
  }: {
    pageParam?: GetMessageParams;
  }) => {
    const response = await axios
      .get(`/api/messages?channelId=${chatId}`, {
        params: {
          ...pageParam,
          cursor: pageParam?.cursor,
          messageId: pageParam?.messageId,
        },
      })
      .then((res) => res.data);

    return response;
  };

  return useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: getMessages,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === null) return undefined;

      return {
        channelId: chatId,
        cursor: lastPage.nextCursor,
        messageId: "",
      };
    },
    initialPageParam: {
      cursor: "",
      channelId: chatId,
      messageId: messageId || "",
    },
  });
}
