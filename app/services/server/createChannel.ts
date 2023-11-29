import { ChannelRequest } from "@/app/types/server";
import axios from "axios";

export async function createChannel(
  url: string,
  { arg }: { arg: ChannelRequest }
) {
  return axios.post(url, arg).then((res) => res.data);
}
