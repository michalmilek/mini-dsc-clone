import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Friendship, Profile } from "@prisma/client";

interface Props {
  friendship: Friendship & {
    friendOne: Profile;
    friendTwo: Profile;
  };
}

const FriendshipMore = ({ friendship }: Props) => {
  const { user } = useUser();
  const { mutate } = useRemoveFriend();
  const { toast } = useToast();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const member =
    user?.id === friendship.friendOneId
      ? friendship.friendOne
      : friendship.friendTwo;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Friendship</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            mutate(friendship.id, {
              onSuccess: () => {
                toast({
                  variant: "success",
                  title: `Friendship with ${member.name} has been removed`,
                });
                router.push("/");
              },
            })
          }>
          Delete friend
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FriendshipMore;
