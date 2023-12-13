import axios from "axios";

import { FriendInvitationStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export const useInviteResponse = (inviteId: string) => {
  const inviteResponse = async ({
    status,
  }: {
    status: FriendInvitationStatus;
  }) => {
    try {
      const response = await axios.post(`/api/friend-invitation/${inviteId}`, {
        status: status as FriendInvitationStatus,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: inviteResponse,
  });
};
