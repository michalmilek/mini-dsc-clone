import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export const useUnblockUser = () => {
  const unblockUser = async (id: string) => {
    try {
      const response = await axios.delete(`/api/remove-from-blacklist/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: unblockUser,
  });
};
