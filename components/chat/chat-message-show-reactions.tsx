"use client";

import {
  ReactionToDirectMessageWithProfile, ReactionToFriendshipMessageWithProfile, ReactionWithProfile
} from '@/app/types/server';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  reactions:
    | ReactionWithProfile[]
    | ReactionToDirectMessageWithProfile[]
    | ReactionToFriendshipMessageWithProfile[]
}

const ChatMessageShowReactions = ({ reactions }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {reactions[0].emoji} ({reactions.length})
        </TooltipTrigger>
        <TooltipContent>
          <ul className="flex flex-col space-y-2">
            {reactions.map((reaction) => (
              <li
                key={reaction.id}
                className="flex items-center space-x-2">
                <span className="text-lg">{reaction.emoji}</span>
                <span className="font-medium">{reaction.profile.name}</span>
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatMessageShowReactions;
