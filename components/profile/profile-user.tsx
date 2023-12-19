"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useBlockUser } from "@/app/services/user/block-user";
import { useRemoveFriend } from "@/app/services/user/remove-friend";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Profile } from "@prisma/client";

const ProfileUser = ({
  profile,
  friendshipId,
}: {
  profile: Profile;
  friendshipId: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: removeFriend } = useRemoveFriend();
  const { mutate: blockUser } = useBlockUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center p-6 rounded-lg shadow-md w-80">
        <div className="w-24 h-24 rounded-full mb-4 relative">
          <Image
            layout="fill"
            src={profile.imageUrl}
            alt={profile.name}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row items-center justify-center my-2">
          <Button
            onClick={() => {
              blockUser(profile.email, {
                onSuccess: () => {
                  router.push("/");
                  toast({
                    title: "User blocked",
                    variant: "success",
                  });
                },
                onError: () => {
                  toast({
                    title: "Error",
                    description: "Could not block user",
                    variant: "destructive",
                  });
                },
              });
            }}>
            Block
          </Button>
          <Button
            onClick={() => {
              removeFriend(friendshipId, {
                onSuccess: () => {
                  router.push("/");
                  toast({
                    title: "User removed from friends",
                    variant: "success",
                  });
                },
                onError: () => {
                  toast({
                    title: "Error",
                    description: "Could not remove friend",
                    variant: "destructive",
                  });
                },
              });
            }}>
            Delete from friends
          </Button>
        </div>
        <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
        <p className="text-gray-500 mb-4">{profile.email}</p>
        <p className="text-sm text-gray-500 mb-2">
          Joined: {format(profile.createdAt, "yyyy-MM-dd")}
        </p>
        <p className="text-sm text-gray-500">
          Last Updated: {format(profile.updatedAt, "yyyy-MM-dd")}
        </p>
      </div>
    </div>
  );
};

export default ProfileUser;
