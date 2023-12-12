"use client";

import { Edit, Hash, Mic, Plus, Trash, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";
import { ServerWithMembersAndChannels } from "@/app/types/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChannelType, MemberRole } from "@prisma/client";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType?: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersAndChannels;
}

const ServerChannelsList = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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
                  <li
                    className="flex items-center justify-between"
                    key={channel.id + "textChannels"}>
                    <Button
                      className="gap-2"
                      onClick={() => {
                        router.push(
                          `/servers/${server?.id}/channels/${channel.id}`
                        );
                      }}
                      variant={"link"}>
                      <Hash />
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
                  <li key={channel.id + "voiceChannels"}>
                    <Button
                      className="gap-2"
                      onClick={() => {
                        router.push(
                          `/servers/${server?.id}/channels/${channel.id}`
                        );
                      }}
                      variant={"link"}>
                      <Mic />
                      {channel.name}
                    </Button>
                  </li>
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
                  <li key={channel.id + "videoChannels"}>
                    <Button
                      className="gap-2"
                      onClick={() => {
                        router.push(
                          `/servers/${server?.id}/channels/${channel.id}`
                        );
                      }}
                      variant={"link"}>
                      <Video />
                      {channel.name}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Members</AccordionTrigger>
          <AccordionContent>
            {members && members?.length > 0 && (
              <ul>
                {members?.map((member) => (
                  <li key={member.id + "members"}>
                    <Button
                      className="gap-2"
                      onClick={() => {
                        router.push(
                          `/servers/${server?.id}/conversations/${member.id}`
                        );
                      }}
                      variant={"link"}>
                      <Avatar>
                        <AvatarImage src={member.profile.imageUrl} />
                        <AvatarFallback>{member.profile.name}</AvatarFallback>
                      </Avatar>
                      {member.profile.name}
                    </Button>
                  </li>
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
