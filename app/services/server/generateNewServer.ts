import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useGenerateNewServer() {
  const generateNewServer = async ({ arg }: { arg: { serverId: string } }) => {
    return axios.patch("/api/servers", arg).then((res) => res.data);
  };

  return useMutation({ mutationFn: generateNewServer });
}
