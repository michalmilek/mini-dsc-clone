import axios from "axios";

export async function deleteServer(url: string, { arg }: { arg: any }) {
  return axios.delete(url).then((res) => res.data);
}
