import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export const useBlockUser = () => {
  const blockUser = async (email: string) => {
    try {
      const response = await axios.post("/api/socket/block-user", { email });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: blockUser,
  });
};
