import axios from "axios";

import { useMutation } from "@tanstack/react-query";

interface Args {
  serverId: string;
  messageId: string;
  reaction: string;
  conversationId?: string;
}

const useReactionMessage = (url: string) => {
  const reactionMessage = async (data: Args) =>
    axios.post(url, data).then((res) => res.data);

  return useMutation({
    mutationFn: reactionMessage,
  });
};

export default useReactionMessage;
