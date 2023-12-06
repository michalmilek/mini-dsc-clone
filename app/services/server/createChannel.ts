import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ChannelRequest } from "@/app/types/server";

export function useCreateChannel() {
  const createChannel = async ({
    url,
    arg,
  }: {
    url: string;
    arg: ChannelRequest;
  }) => {
    return axios.post(url, arg).then((res) => res.data);
  };

  return useMutation({ mutationFn: createChannel });
}
