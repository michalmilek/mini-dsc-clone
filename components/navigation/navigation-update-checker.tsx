"use client";

import { useGlobalSocket } from "@/app/hooks/use-global-socket";
import { Friendship } from "@/types/friendship";
import { FriendInvitation } from "@prisma/client";

interface Props {
  allInvitations: FriendInvitation[];
  friends: Friendship[];
  id: string;
}

const NavigationUpdateChecker = ({
  allInvitations,
  friends,
  id: myId,
}: Props) => {
  const ids = allInvitations.flatMap((invitation) => [
    invitation.senderId,
    invitation.receiverId,
    invitation.id,
  ]);

  const friendsIds = friends.flatMap((friendship) => [
    friendship.friendOneId,
    friendship.friendTwoId,
    friendship.id,
  ]);

  const filteredArr = [...new Set([...ids, ...friendsIds, myId])];

  useGlobalSocket(filteredArr);

  return null;
};

export default NavigationUpdateChecker;
