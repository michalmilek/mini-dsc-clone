import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Request {
  params: {
    memberId: string;
  };
}

export function useDeleteUser() {
  const deleteUser = async ({ url, arg }: { url: string; arg: Request }) => {
    return axios
      .delete(url, {
        params: {
          memberId: arg.params.memberId,
        },
      })
      .then((res) => res.data);
  };

  return useMutation({ mutationFn: deleteUser });
}
