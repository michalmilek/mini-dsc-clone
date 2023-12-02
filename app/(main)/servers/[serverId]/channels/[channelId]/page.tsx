import ChatInput from "@/components/chat/chat-input";
import ServerHeader from "@/components/server/server-header";
import { db } from "@/lib/db";

const ChannelIdPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const { channelId } = params;

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    return null;
  }

  return (
    <div>
      <ServerHeader
        type="channel"
        channel={channel}
      />
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
