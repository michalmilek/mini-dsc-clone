"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Friendship } from "@/types/friendship";
import { useUser } from "@clerk/nextjs";

const NavigationFriend = ({ friendship }: { friendship: Friendship }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  console.log("🚀 ~ user:", user);

  const [mounted, setMounted] = useState(false);
  const params = useParams();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return null;
  }

  const member =
    friendship.friendOne.id === user?.id
      ? friendship.friendTwo
      : friendship.friendOne;

  if (!mounted) {
    return null;
  }
  return (
    <li className={cn("w-full flex-col flex items-center justify-center")}>
      <Link href={`/friendship/${friendship.id}`}>
        <div className={cn("relative w-12 h-12")}>
          <Image
            layout="fill"
            src={member.imageUrl}
            alt={member.name}
            className={cn(
              "rounded-full border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200"
            )}
          />
        </div>
      </Link>
    </li>
  );
};

export default NavigationFriend;
