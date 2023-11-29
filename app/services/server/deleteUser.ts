import axios from "axios";

interface Request {
  params: {
    memberId: string;
  };
}

export async function deleteUser(url: string, { arg }: { arg: Request }) {
  return axios
    .delete(url, {
      params: {
        memberId: arg.params.memberId,
      },
    })
    .then((res) => res.data);
}
