import { redirect } from "next/navigation";

import { ChatFriendMessages } from "@/components/chat/chat-friend-messages";
import ChatFriendshipHeader from "@/components/chat/chat-friendship-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const Page = async ({ params }: { params: { friendshipId: string } }) => {
  const profile = await currentProfile();

  if (!profile) {
    return null;
  }

  if (!params.friendshipId) {
    return null;
  }

  const friendship = await db.conversationBetweenFriends.findFirst({
    where: {
      id: params.friendshipId,
    },
    include: {
      friendOne: true,
      friendTwo: true,
    },
  });

  if (!friendship) {
    return redirect("/");
  }

  const member =
    friendship.friendOne.id === profile.id
      ? friendship.friendTwo
      : friendship.friendOne;

  return (
    <div className="h-screen overflow-y-hidden justify-between flex flex-col relative pl-32">
      <ChatFriendshipHeader
        member={member}
        friendship={friendship}
      />
      <ChatFriendMessages
        myId={profile.id}
        apiUrl="/api/friend-messages"
        member={member}
        type="conversation"
        name={member.name}
        socketUrl="/api/socket/friend-messages"
        socketQuery={{
          conversationId: friendship.id,
        }}
        paramKey="friendshipId"
        paramValue={friendship.id}
        chatId={friendship.id}
      />
      <ChatInput
        name={member.name}
        type="conversation"
        apiUrl="/api/socket/friend-messages"
        query={{
          friendshipId: friendship.id,
        }}
      />
      {/* <ChatDirectMediaRoom chatId={conversation.id} /> */}
    </div>
  );
};

export default Page;
