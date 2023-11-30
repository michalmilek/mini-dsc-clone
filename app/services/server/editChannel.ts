import { ChannelRequest } from "@/app/types/server";
import axios from "axios";

export async function editChannel(
  url: string,
  { arg }: { arg: ChannelRequest }
) {
  return axios.patch(url, arg).then((res) => res.data);
}
