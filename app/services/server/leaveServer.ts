import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useLeaveServer() {
  const leaveServer = async (url: string) => {
    return axios.patch(url).then((res) => res.data);
  };

  return useMutation({ mutationFn: leaveServer });
}
