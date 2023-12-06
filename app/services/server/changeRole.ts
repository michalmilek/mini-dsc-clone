import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Request {
  body: {
    role: "GUEST" | "MODERATOR";
  };
  params: {
    memberId: string;
  };
}

export function useChangeRole() {
  const changeRole = async ({ url, arg }: { url: string; arg: Request }) => {
    return axios
      .patch(url, arg.body, { params: { memberId: arg.params.memberId } })
      .then((res) => res.data);
  };

  return useMutation({ mutationFn: changeRole });
}
