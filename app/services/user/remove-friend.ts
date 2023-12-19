import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export const useRemoveFriend = () => {
  const removeFriend = async (friendshipId: string) => {
    try {
      const response = await axios.delete(
        `/api/socket/friendship/${friendshipId}`
      );
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
