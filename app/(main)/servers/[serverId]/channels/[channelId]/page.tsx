import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatInput from "@/components/chat/chat-input";
import { ChatMediaRoom } from "@/components/chat/chat-media-room";
import { ChatMessages } from "@/components/chat/chat-messages";
import ServerHeader from "@/components/server/server-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const ChannelIdPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const { channelId } = params;

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
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

  return (
    <div className="h-screen overflow-y-hidden justify-between flex flex-col relative">
      <ServerHeader
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
  );
};

export default ChannelIdPage;
