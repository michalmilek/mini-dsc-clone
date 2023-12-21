import { useEffect } from "react";

import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  channelId: string;
  reactionAddKey: string;
  reactionDeleteKey: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  channelId,
  reactionAddKey,
  reactionDeleteKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (!channelId) {
      return;
    }

    socket.on(updateKey, () => {
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] });
    });

    socket.on(addKey, () => {
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] });
    });

    socket.on(reactionAddKey, () => {
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] });
    });

    socket.on(reactionDeleteKey, () => {
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
      socket.off(reactionAddKey);
      socket.off(reactionDeleteKey);
    };
  }, [queryClient, addKey, updateKey, socket, channelId, reactionAddKey]);
};
