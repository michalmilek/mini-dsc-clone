import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Args {
  params: Record<string, string>;
}

export function useDeleteMessage() {
  const deleteMessage = async ({ url, args }: { url: string; args: Args }) => {
    return axios.delete(url, { params: args.params }).then((res) => res.data);
  };

  return useMutation({
    mutationFn: deleteMessage,
  });
}
