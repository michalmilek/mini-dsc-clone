"use client";

import { Check, XIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useInviteResponse } from "@/app/services/user/invite-response";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";

interface Invitation {
  id: string;
  senderId: string;
  receiverId: string;
  status: $Enums.FriendInvitationStatus;
  createdAt: Date; // Assuming your Date properties are stored as strings
  updatedAt: Date;
  sender: {
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const NavigationInvitation = ({ invitation }: { invitation: Invitation }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate } = useInviteResponse(invitation.id);
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <li
      title={invitation.sender.name + " Friend invitation"}
      className={cn("w-full flex-col flex items-center justify-between")}>
      <span className="text-center">{invitation.sender.name}</span>
      <div className="w-full flex items-center justify-between">
        <div className={cn("relative w-12 h-12")}>
          <Image
            layout="fill"
            src={invitation.sender.imageUrl}
            alt={invitation.sender.name}
            className={cn(
              "rounded-full border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200"
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-between py-1">
          <button
            onClick={() => {
              mutate(
                {
                  status: "ACCEPTED",
                },
                {
                  onSuccess: () => {
                    toast({
                      variant: "success",
                      title: "Invitation accepted",
                    });
                    router.refresh();
                  },
                }
              );
            }}
            title="Accept invitation">
            <Check className="text-green-500" />
          </button>
          <button
            onClick={() => {
              mutate(
                {
                  status: "DECLINED",
                },
                {
                  onSuccess: () => {
                    toast({
                      variant: "success",
                      title: "Invitation accepted",
                    });
                    router.refresh();
                  },
                }
              );
            }}
            title="Decline Invitation">
            <XIcon className="text-red-500" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default NavigationInvitation;
