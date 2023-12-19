import { useEffect } from "react";

import { revalidateLayout } from "@/app/actions/revalidateLayout";
import { useSocket } from "@/components/providers/socket-provider";

export const useGlobalSocket = (keys: string[]) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    keys.forEach((key) => {
      const addFriendKey = `navigation:${key}:addFriend`;
      const invitationResponseKey = `navigation:${key}:invitationResponse`;
      const friendshipKey = `navigation:${key}:blockUser`;
      const deleteFriendshipKey = `navigation:${key}:deleteFriendship`;

      socket.on(addFriendKey, async () => {
        console.log("add friend");
        revalidateLayout();
      });

      socket.on(invitationResponseKey, async () => {
        console.log("invitation response received");
        revalidateLayout();
      });

      socket.on(friendshipKey, async () => {
        console.log("Blockade made");
        revalidateLayout();
      });

      socket.on(deleteFriendshipKey, async () => {
        console.log("Blockade made");
        revalidateLayout();
      });
    });

    return () => {
      keys.forEach((key) => {
        const addFriendKey = `navigation:${key}:addFriend`;
        const invitationResponseKey = `navigation:${key}:invitationResponse`;
        const friendshipKey = `navigation:${key}:blockUser`;
        const deleteFriendshipKey = `navigation:${key}:deleteFriendship`;

        socket.off(addFriendKey);
        socket.off(invitationResponseKey);
        socket.off(friendshipKey);
        socket.off(deleteFriendshipKey);
      });
    };
  }, [keys, socket]);
};
