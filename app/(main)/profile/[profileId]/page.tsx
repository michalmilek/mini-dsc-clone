import { redirect } from "next/navigation";

import NotFoundCountdown from "@/components/not-found/not-found-countdown";
import ProfileUser from "@/components/profile/profile-user";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const Page = async ({ params }: { params: { profileId: string } }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const friendship = await db.conversationBetweenFriends.findFirst({
    where: {
      OR: [
        {
          friendOneId: profile.id,
          friendTwoId: params.profileId,
        },
        {
          friendOneId: params.profileId,
          friendTwoId: profile.id,
        },
      ],
    },
    include: {
      friendOne: true,
      friendTwo: true,
    },
  });

  if (!friendship) {
    return (
      <div className="h-full w-full pl-32 flex items-center justify-center">
        <NotFoundCountdown />
      </div>
    );
  }

  const userTwo =
    friendship.friendOne.id === profile.id
      ? friendship.friendTwo
      : friendship.friendOne;

  return (
    <div className="h-full w-full pl-32 flex items-center justify-center">
      <ProfileUser
        friendshipId={friendship.id}
        profile={userTwo}
      />
    </div>
  );
};

export default Page;
