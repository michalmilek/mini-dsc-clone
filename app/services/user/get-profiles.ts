import axios from "axios";

import { useQuery } from "@tanstack/react-query";

export const useGetUserManual = (query: string) => {
  const getUsers = async () => {
    try {
      const response = await axios.get(`/api/get-profiles/${query}`);

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const response = useQuery({
    queryKey: ["query", query],
    queryFn: () => getUsers(),
    enabled: !!query,
    retry: false,
  });

  return response;
};
