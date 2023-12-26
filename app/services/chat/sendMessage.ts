import axios from "axios";

import { useSendMessageHook } from "@/app/hooks/use-send-message";
import { useMutation } from "@tanstack/react-query";

interface MessageInterface {
  body: {
    content: string;
  };
  params: Record<string, any>;
}

export function useSendMessage() {
  const { setSentTrue } = useSendMessageHook();
  const sendMessage = async ({
    url,
    arg,
  }: {
    url: string;
    arg: MessageInterface;
  }) => {
    return axios
      .post(url, arg.body, { params: arg.params })
      .then((res) => res.data);
  };

  return useMutation({
    mutationFn: sendMessage,
    mutationKey: ["sendMessage"],
    onSuccess: () => {
      setSentTrue();
    },
  });
}
