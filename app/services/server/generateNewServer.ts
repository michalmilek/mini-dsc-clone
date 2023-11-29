import axios from "axios";

export async function generateNewServer(
  url: string,
  { arg }: { arg: { serverId: string } }
) {
  return axios.patch(url, arg).then((res) => res.data);
}
