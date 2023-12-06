import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface MessageInterface {
  body: {
    content: string;
  };
  params: Record<string, any>;
}

export function useSendMessage() {
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

  return useMutation({ mutationFn: sendMessage });
}
