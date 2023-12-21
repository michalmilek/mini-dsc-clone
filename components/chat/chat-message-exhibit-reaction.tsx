"use client";

import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { useDeleteReaction } from "@/app/services/chat/deleteReaction";
import useReactionMessage from "@/app/services/chat/reactionMessage";
import { ReactionWithProfile } from "@/app/types/server";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface Props {
  messageId: string;
  serverId: string;
  myReaction: ReactionWithProfile | undefined;
  apiUrl: string;
  type: "channel" | "conversation";
  conversationId?: string;
}

const ChatMessageExhibitReaction = ({
  messageId,
  serverId,
  myReaction,
  apiUrl,
  type,
  conversationId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const { mutate } = useReactionMessage(apiUrl + "add-reaction");
  const { mutate: deleteReaction } = useDeleteReaction();
  const { toast } = useToast();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="p-0 m-0  w-auto border-0">
        <Popover
          open={isOpen}
          onOpenChange={() => setIsOpen((prev) => !prev)}>
          <PopoverTrigger
            asChild
            className="p-0 m-0 cursor-pointer">
            <Smile className="h-4 w-4" />
          </PopoverTrigger>
          <PopoverContent
            side="right"
            sideOffset={40}>
            <Picker
              theme={resolvedTheme}
              data={data}
              onEmojiSelect={(emoji: any) => {
                mutate(
                  {
                    messageId,
                    reaction: emoji.native,
                    serverId,
                    conversationId,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        variant: "success",
                        title: "Reaction added",
                      });
                      setIsOpen(false);
                    },
                    onError: () => {
                      toast({
                        variant: "destructive",
                        title: "Error adding reaction",
                      });
                    },
                  }
                );
              }}
            />
          </PopoverContent>
        </Popover>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {myReaction && (
          <ContextMenuItem
            onClick={() =>
              deleteReaction(
                {
                  url: `${apiUrl}reaction/${myReaction.id}`,
                },
                {
                  onSuccess: () => {
                    toast({
                      variant: "success",
                      title: "Reaction removed",
                    });
                  },
                  onError: () => {
                    toast({
                      variant: "destructive",
                      title: "Error removing reaction",
                    });
                  },
                }
              )
            }>
            Remove reaction
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ChatMessageExhibitReaction;
