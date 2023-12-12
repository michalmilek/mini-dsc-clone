"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface ServerProps {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NavigationItem = ({ server }: { server: ServerProps }) => {
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
      title={server.name}
      className={cn("w-full flex items-center justify-center")}>
      <Link
        href={`/servers/${server.id}`}
        className={`flex servers-center p-2 space-x-3 dark: rounded-md ${
          params?.serverId === server.id && "box"
        }`}>
        <div className={cn("relative w-16 h-16")}>
          <Image
            layout="fill"
            src={server.imageUrl}
            alt={server.name}
            className={cn(
              "rounded-full border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200"
            )}
          />
        </div>
      </Link>
    </li>
  );
};

export default NavigationItem;
