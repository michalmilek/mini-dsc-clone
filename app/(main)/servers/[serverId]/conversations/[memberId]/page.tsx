import { redirect } from "next/navigation";

import { ChatDirectMediaRoom } from "@/components/chat/chat-direct-media-room";
import { ChatDirectMessages } from "@/components/chat/chat-direct-messages";
import ServerHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";

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

  const server = await db.server.findFirst({
    where: {
      id: params?.serverId as string,
    },
  });

  if (!server) {
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

  const title = `${otherMember.profile.name} - server conversation`;

  return (
    <>
      <title>{title}</title>
      <div className="h-screen overflow-y-hidden justify-between flex flex-col relative">
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
        <ChatDirectMediaRoom chatId={conversation.id} />
      </div>
    </>
  );
};

export default MemberIdPage;
