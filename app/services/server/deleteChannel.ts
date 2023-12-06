import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteChannel() {
  const deleteChannel = async (url: string) => {
    return axios.delete(url).then((res) => res.data);
  };

  return useMutation({ mutationFn: deleteChannel });
}
