import { NewServerRequest } from "@/app/types/server";
import axios from "axios";

export async function editServer(
  url: string,
  { arg }: { arg: NewServerRequest }
) {
  return axios.patch(url, arg).then((res) => res.data);
}
