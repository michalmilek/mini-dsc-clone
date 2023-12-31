import axios from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

interface GetMessageParams {
  cursor?: string;
  friendshipId?: string;
  messageId?: string;
}

export function useGetFriendMessages({
  friendshipId,
  initialCursor = 1,
  messageId,
}: {
  friendshipId: string;
  initialCursor?: number;
  messageId?: string;
}) {
  const getMessages = async ({
    pageParam,
  }: {
    pageParam?: GetMessageParams;
  }) => {
    const response = await axios
      .get(`/api/friend-messages?friendshipId=${friendshipId}`, {
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
    queryKey: ["messages", friendshipId],
    queryFn: getMessages,
    refetchInterval: 1000,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === null) return undefined;

      return {
        friendshipId: friendshipId,
        cursor: lastPage.nextCursor,
        messageId: "",
      };
    },
    initialPageParam: {
      cursor: "",
      friendshipId: friendshipId,
      messageId: messageId || "",
    },
  });
}
