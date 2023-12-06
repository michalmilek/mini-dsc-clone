import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { ChannelRequest } from "@/app/types/server";

export function useEditChannel() {
  const editChannel = async ({
    url,
    arg,
  }: {
    url: string;
    arg: ChannelRequest;
  }) => {
    return axios.patch(url, arg).then((res) => res.data);
  };

  return useMutation({ mutationFn: editChannel });
}
