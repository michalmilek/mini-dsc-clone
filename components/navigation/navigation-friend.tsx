"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useBlockUser } from "@/app/services/user/block-user";
import { useRemoveFriend } from "@/app/services/user/remove-friend";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Friendship } from "@/types/friendship";
import { useUser } from "@clerk/nextjs";

const NavigationFriend = ({ friendship }: { friendship: Friendship }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { mutate } = useRemoveFriend();
  const { mutate: block } = useBlockUser();
  const pathname = usePathname();
  const member =
    friendship.friendOne.imageUrl === user?.imageUrl
      ? friendship.friendTwo
      : friendship.friendOne;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return null;
  }

  if (!mounted) {
    return null;
  }
  return (
    <li
      className={cn(
        "w-full flex-col flex items-center justify-center p-4",
        pathname?.includes(friendship.id) && "box"
      )}>
      <Link href={`/friendship/${friendship.id}`}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className={cn(`relative w-12 h-12`)}>
              {friendship.directMessagesBetweenFriends.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="absolute z-10 top-0 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                        {friendship.directMessagesBetweenFriends.length}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {friendship.directMessagesBetweenFriends.length} unread
                        message/messages from {member.name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Image
                layout="fill"
                src={member.imageUrl}
                alt={member.name}
                className={cn(
                  "rounded-full border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200"
                )}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                mutate(friendship.id, {
                  onSuccess: () => {
                    toast({
                      title: "Removed friend",
                      description: `You removed ${member.name} from your friends.`,
                      variant: "success",
                    });
                  },
                });
              }}>
              Remove Friend
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                block(member.email, {
                  onSuccess: () => {
                    toast({
                      title: "Blocked friend",
                      description: `You succesfully blocked ${member.name}`,
                      variant: "success",
                    });
                  },
                });
              }}>
              Block user
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Link>
    </li>
  );
};

export default NavigationFriend;
