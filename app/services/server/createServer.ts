import { NewServerRequest } from "@/app/types/server";
import axios, { AxiosError } from "axios";
import useSWR from "swr";

export const useCreateServer = () => {
  const path = "/api/servers";
  const swr = useSWR(path);

  const createNewServer = async (form: NewServerRequest) => {
    try {
      const response = await axios.post(path, form);
      swr.mutate(response.data);
    } catch (error) {
      throw error;
    }
  };

  return { createNewServer, swr };
};

export async function createNewServerFn(
  url: string,
  { arg }: { arg: NewServerRequest }
) {
  return axios.post(url, arg).then((res) => res.data);
}
