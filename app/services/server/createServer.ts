import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewServerRequest } from "@/app/types/server";

export function useCreateNewServer() {
  const createNewServer = async (arg: NewServerRequest) => {
    return axios.post("/api/servers", arg).then((res) => res.data);
  };

  return useMutation({ mutationFn: createNewServer });
}
