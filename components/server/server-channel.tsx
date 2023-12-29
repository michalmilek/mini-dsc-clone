"use client";

import { Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { useModal } from "@/app/hooks/use-modal-store";
import { getIconByType } from "@/app/utils/get-icon-by-type";
import { Button } from "@/components/ui/button";
import { Channel, MemberRole } from "@prisma/client";

const ServerChannel = ({
  channel,
  role,
}: {
  channel: Channel;
  role: MemberRole;
}) => {
  const router = useRouter();
  const { onOpen } = useModal();
  return (
    <li
      className="flex items-center justify-between"
      key={channel.id + "textChannels"}>
      <Button
        className="gap-2"
        onClick={() => {
          router.push(`/servers/${channel.serverId}/channels/${channel.id}`);
        }}
        variant={"link"}>
        {getIconByType(channel.type)}
        {channel.name}
      </Button>
      {role !== "GUEST" && (
        <div className="flex gap-1 items-center text-sm">
          <button
            onClick={() =>
              onOpen("editChannel", {
                channel,
              })
            }
            title="Edit channel">
            <Edit className="h-4 w-4" />
          </button>
          <button
            title="Delete channel"
            onClick={() =>
              onOpen("deleteChannel", {
                channel,
              })
            }>
            <Trash className="h-4 w-4" />
          </button>
        </div>
      )}
    </li>
  );
};

export default ServerChannel;
