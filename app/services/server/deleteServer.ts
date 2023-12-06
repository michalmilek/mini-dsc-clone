import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteServer() {
  const deleteServer = async (url: string) => {
    return axios.delete(url).then((res) => res.data);
  };

  return useMutation({ mutationFn: deleteServer });
}
