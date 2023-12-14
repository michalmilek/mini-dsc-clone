import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export const useRemoveFriendFromFriendlist = () => {
  const removeFriend = async (id: string) => {
    try {
      const response = await axios.delete(`/api/remove-friend/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: removeFriend,
  });
};
