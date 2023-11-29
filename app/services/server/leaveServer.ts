import axios from "axios";

export async function leaveServer(url: string, { arg }: { arg: any }) {
  return axios.patch(url).then((res) => res.data);
}
