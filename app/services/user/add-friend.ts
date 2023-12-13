import axios from "axios";

import { useMutation } from "@tanstack/react-query";

export const useAddFriend = () => {
  const addFriend = async (email: string) => {
    try {
      const response = await axios.post("/api/add-friend", { email });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: addFriend,
  });
};
