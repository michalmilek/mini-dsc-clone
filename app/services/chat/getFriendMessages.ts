import axios from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

interface GetMessageParams {
  cursor?: string;
  friendshipId?: string;
}

export function useGetFriendMessages({
  friendshipId,
  initialCursor = 1,
}: {
  friendshipId: string;
  initialCursor?: number;
}) {
  const getMessages = async ({
    pageParam,
  }: {
    pageParam?: GetMessageParams;
  }) => {
    const response = await axios
      .get(`/api/friend-messages?friendshipId=${friendshipId}`, {
        params: { ...pageParam, cursor: pageParam?.cursor },
      })
      .then((res) => res.data);

    return response;
  };

  return useInfiniteQuery({
    queryKey: ["messages", friendshipId],
    queryFn: getMessages,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextCursor === null) return undefined;

      return {
        friendshipId: friendshipId,
        cursor: lastPage.nextCursor,
      };
    },
    initialPageParam: {
      cursor: "",
      friendshipId: friendshipId,
    },
  });
}
