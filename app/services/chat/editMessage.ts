import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Args {
  params: Record<string, string>;
  content: string;
}

export function useEditMessage() {
  const editMessage = async ({ url, args }: { url: string; args: Args }) => {
    return axios
      .patch(url, { content: args.content }, { params: args.params })
      .then((res) => res.data);
  };

  return useMutation({
    mutationFn: editMessage,
  });
}
