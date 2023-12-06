import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSocket } from "@/components/providers/socket-provider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  channelId: string;
};

export const useChatSocket = ({
  addKey,
  updateKey,
  channelId,
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

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, socket, channelId]);
};
