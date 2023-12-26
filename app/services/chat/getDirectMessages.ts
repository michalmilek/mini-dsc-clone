import axios from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

interface GetMessageParams {
  cursor?: string;
  conversationId?: string;
  messageId?: string;
}

export function useGetDirectMessages({
  conversationId,
  initialCursor = 1,
  messageId,
}: {
  conversationId: string;
  initialCursor?: number;
  messageId?: string;
}) {
  const getMessages = async ({
    pageParam,
  }: {
    pageParam?: GetMessageParams;
  }) => {
    const response = await axios
      .get(`/api/direct-messages?conversationId=${conversationId}`, {
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
    queryKey: ["messages", conversationId],
    queryFn: getMessages,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === null) return undefined;

      return {
        conversationId: conversationId,
        cursor: lastPage.nextCursor,
        messageId: "",
      };
    },
    initialPageParam: {
      cursor: "",
      conversationId: conversationId,
      messageId: messageId || "",
    },
  });
}
