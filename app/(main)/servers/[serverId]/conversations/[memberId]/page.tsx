import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ChatDirectMessages } from "@/components/chat/chart-direct-messages";
import ChatInput from "@/components/chat/chat-input";
import ServerHeader from "@/components/server/server-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

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
    <div className="h-screen overflow-y-hidden justify-between flex flex-col">
      <ServerHeader
        type="conversation"
        member={otherMember}
      />
      <ChatDirectMessages
        apiUrl="/api/direct-messages"
        member={currentMember}
        type="conversation"
        name={otherMember.profile.name}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id,
        }}
        paramKey="conversationId"
        paramValue={conversation.id}
        chatId={conversation.id}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="channel"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;