import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface GetMessageParams {
  cursor?: string;
  conversationId?: string;
}

export function useGetDirectMessages({
  conversationId,
  initialCursor = 1,
}: {
  conversationId: string;
  initialCursor?: number;
}) {
  const getMessages = async ({
    pageParam,
  }: {
    pageParam?: GetMessageParams;
  }) => {
    const response = await axios
      .get(`/api/direct-messages?conversationId=${conversationId}`, {
        params: { ...pageParam, cursor: pageParam?.cursor },
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
      };
    },
    initialPageParam: {
      cursor: "",
      conversationId: conversationId,
    },
  });
}
