import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export function useDeleteReaction() {
  const deleteReaction = async ({ url }: { url: string }) => {
    return axios.delete(url).then((res) => res.data);
  };

  return useMutation({
    mutationFn: deleteReaction,
  });
}
