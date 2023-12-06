import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface GetMessageParams {
  cursor?: string;
  channelId?: string;
}

export function useGetMessages({
  chatId,
  initialCursor = 1,
}: {
  chatId: string;
  initialCursor?: number;
}) {
  const getMessages = async ({
    pageParam,
  }: {
    pageParam?: GetMessageParams;
  }) => {
    const response = await axios
      .get(`/api/messages?channelId=${chatId}`, {
        params: { ...pageParam, cursor: pageParam?.cursor },
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
      };
    },
    initialPageParam: {
      cursor: "",
      channelId: chatId,
    },
  });
}
