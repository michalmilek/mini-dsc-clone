"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

import { useModal } from "@/app/hooks/use-modal-store";
import { useRemoveFriend } from "@/app/services/user/remove-friend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Profile } from "@prisma/client";

const ProfileSettings = ({ blacklist }: { blacklist: Profile[] }) => {
  const { user } = useUser();
  const { mutate } = useRemoveFriend();
  const { onOpen } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  if (!user) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Settings />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile settings</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            onOpen("blacklist", {
              blacklist,
            })
          }>
          Blacklist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSettings;
