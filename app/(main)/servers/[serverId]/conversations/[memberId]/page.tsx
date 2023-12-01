import ServerHeader from "@/components/server/server-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const MemberIdPage = async ({
  params,
}: {
  params: { serverId: string; memberId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  if (currentMember?.profile.id !== profile.id) {
    return redirect("/");
  }

  let conversation = await db.conversation.findFirst({
    where: {
      OR: [
        {
          memberOneId: params.memberId,
          memberTwoId: currentMember?.id,
        },
        {
          memberOneId: currentMember?.id,
          memberTwoId: params.memberId,
        },
      ],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!conversation) {
    conversation = await db.conversation.create({
      data: {
        memberOneId: currentMember?.id,
        memberTwoId: params.memberId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    profile.id === memberOne.profileId ? memberTwo : memberOne;

  return (
    <div>
      <ServerHeader
        type="conversation"
        member={otherMember}
      />
    </div>
  );
};

export default MemberIdPage;
