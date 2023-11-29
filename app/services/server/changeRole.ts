import axios from "axios";
import { stringify } from "qs";

interface Request {
  body: {
    role: "GUEST" | "MODERATOR";
  };
  params: {
    memberId: string;
  };
}

export async function changeRole(url: string, { arg }: { arg: Request }) {
  return axios
    .patch(url, arg.body, {
      params: {
        memberId: arg.params.memberId,
      },
    })
    .then((res) => res.data);
}
