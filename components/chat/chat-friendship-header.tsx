"use client";

import { Phone, Search, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import { useModal } from "@/app/hooks/use-modal-store";
import { FriendshipFriend } from "@/app/types/server";
import FriendshipMore from "@/components/friendship/friendship-more";
import { SocketIndicator } from "@/components/socket-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Friendship, Profile } from "@prisma/client";

interface Props {
  member: FriendshipFriend;
  friendship: Friendship & {
    friendOne: Profile;
    friendTwo: Profile;
  };
}

const ChatFriendshipHeader = ({ member, friendship }: Props) => {
  const { onOpen } = useModal();

  const router = useRouter();

  const params = useParams();

  const isLargerThan640 = useMediaQuery({
    query: "(min-width: 640px)",
  });
  const isLargerThan850 = useMediaQuery({
    query: "(min-width: 850px)",
  });

  return (
    <header className="p-2 sm:p-6 justify-between flex flex-col border-b-2 border-gray-200">
      <div className="flex sm:items-center justify-between py-3 ">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={member?.imageUrl}
                  alt={member?.name}
                />
                <AvatarFallback>{member?.name}</AvatarFallback>
              </Avatar>

              <span className="text-xs md:text-md text-gray-700 dark:text-gray-300 mr-3">
                {member?.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isLargerThan640 ? (
            <span className="text-lg  text-gray-600 dark:text-gray-400">
              Created at: {friendship.createdAt?.toLocaleDateString()}
            </span>
          ) : (
            <Button
              onClick={() => {
                router.push("/");
              }}>
              Main menu
            </Button>
          )}
          <>
            <Button
              onClick={() =>
                onOpen("calls", {
                  callData: {
                    audio: true,
                    video: false,
                  },
                })
              }
              type="button">
              <Phone />
            </Button>
            <Button
              onClick={() =>
                onOpen("calls", {
                  callData: {
                    audio: true,
                    video: true,
                  },
                })
              }
              type="button">
              <Video />
            </Button>
          </>
          <Button
            onClick={() => {
              if (params?.friendshipId) {
                onOpen("findFriendshipMessage", {
                  chatId: params.friendshipId as string,
                });
              }
            }}
            type="button">
            <Search />
          </Button>
          <FriendshipMore friendship={friendship} />
          {isLargerThan850 && <SocketIndicator />}
        </div>
      </div>
    </header>
  );
};

export default ChatFriendshipHeader;
