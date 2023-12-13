import ChatFriendshipHeader from "@/components/chat/chat-friendship-header";
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
    return (
      <div className="w-full flex justify-center items-center h-full">
        <div className="text-2xl">No friendship found</div>
      </div>
    );
  }

  const member =
    friendship.friendOne.id === profile.id
      ? friendship.friendTwo
      : friendship.friendOne;

  return (
    <div className="w-full h-full pl-32">
      <ChatFriendshipHeader
        member={member}
        friendship={friendship}
      />
    </div>
  );
};

export default Page;
