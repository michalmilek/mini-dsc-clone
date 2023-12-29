"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useModal } from "@/app/hooks/use-modal-store";
import { ServerWithMembersAndChannels } from "@/app/types/server";
import ServerChannel from "@/components/server/server-channel";
import ServerMember from "@/components/server/server-member";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MemberRole } from "@prisma/client";

interface ServerSectionProps {
  role?: MemberRole;
  server?: ServerWithMembersAndChannels;
  myId: string;
}

const ServerChannelsList = ({ role, server, myId }: ServerSectionProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const textChannels = server?.channels.filter(
    (channel) => channel.type === "TEXT"
  );

  const audioChnanels = server?.channels.filter(
    (channel) => channel.type === "AUDIO"
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === "VIDEO"
  );

  const members = server?.members;

  const membersWithoutMe = members?.filter((member) => member.id !== myId);

  if (!role) {
    return null;
  }

  return (
    <div>
      {role !== "GUEST" && (
        <>
          <Button
            variant={"outline"}
            onClick={() => onOpen("createChannel", { server })}
            className="w-full items-center justify-between">
            Create channel
            <Plus />
          </Button>
        </>
      )}
      <Accordion
        type="single"
        collapsible
        className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Text channels</AccordionTrigger>
          <AccordionContent>
            {textChannels && textChannels?.length > 0 && (
              <ul>
                {textChannels?.map((channel) => (
                  <ServerChannel
                    channel={channel}
                    role={role}
                    key={channel.id + "channel list"}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Voice channels</AccordionTrigger>
          <AccordionContent>
            {audioChnanels && audioChnanels?.length > 0 && (
              <ul>
                {audioChnanels?.map((channel) => (
                  <ServerChannel
                    channel={channel}
                    role={role}
                    key={channel.id + "channel list"}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Video channels</AccordionTrigger>
          <AccordionContent>
            {videoChannels && videoChannels?.length > 0 && (
              <ul>
                {videoChannels?.map((channel) => (
                  <ServerChannel
                    channel={channel}
                    role={role}
                    key={channel.id + "channel list"}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Members</AccordionTrigger>
          <AccordionContent>
            {membersWithoutMe && membersWithoutMe?.length > 0 && (
              <ul className="space-y-2">
                {members?.map((member) => (
                  <ServerMember
                    member={member}
                    key={member.id + "server member"}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ServerChannelsList;
