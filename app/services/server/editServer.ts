import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewServerRequest } from "@/app/types/server";

export function useEditServer() {
  const editServer = async ({
    url,
    arg,
  }: {
    url: string;
    arg: NewServerRequest;
  }) => {
    return axios.patch(url, arg).then((res) => res.data);
  };

  return useMutation({ mutationFn: editServer });
}
