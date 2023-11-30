import axios from "axios";

export async function deleteChannel(url: string, { arg }: { arg: any }) {
  return axios.delete(url).then((res) => res.data);
}
