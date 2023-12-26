"use client";

import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Profile } from "@prisma/client";

const ChatTalkerTooltip = ({ profile }: { profile: Profile }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="h-12 w-12 relative rounded-full">
            <Image
              fill
              src={profile.imageUrl}
              alt={profile.name}
              className="rounded-full"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div className="h-12 w-12 relative rounded-full">
              <Image
                fill
                src={profile.imageUrl}
                alt={profile.name}
                className="rounded-full"
              />
            </div>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{profile.name}</div>
              <p className=" text-base">{profile.email}</p>
              <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-400 mr-2 mb-2">
                Created at: {new Date(profile.createdAt).toLocaleDateString()}
              </span>
              <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-400 mr-2 mb-2">
                Updated at: {new Date(profile.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ChatTalkerTooltip;
