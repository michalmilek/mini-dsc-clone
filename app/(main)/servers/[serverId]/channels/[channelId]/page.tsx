import { redirect } from "next/navigation";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMediaRoom } from "@/components/chat/chat-media-room";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";

const ChannelIdPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findFirst({
    where: {
      serverId: params.serverId,
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!member || !channel) {
    return redirect("/");
  }

  const title = `${channel.name} - ${channel.type.toLowerCase()} channel`;

  return (
    <>
      <title>{title}</title>
      <div className="h-screen overflow-y-hidden justify-between flex flex-col relative">
        <ChatHeader
          type="channel"
          channel={channel}
        />
        <ChatMessages
          apiUrl="/api/messages"
          member={member}
          type="channel"
          name={channel.name}
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channelId,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
          chatId={channel.id}
        />
        {channel.type === "VIDEO" && (
          <ChatMediaRoom
            chatId={channelId}
            audio={true}
            video={true}
          />
        )}
        {channel.type === "AUDIO" && (
          <ChatMediaRoom
            chatId={channelId}
            audio={true}
            video={false}
          />
        )}
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      </div>
    </>
  );
};

export default ChannelIdPage;
