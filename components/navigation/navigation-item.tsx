"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

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
  const params = useParams();
  return (
    <li
      title={server.name}
      className={cn("rounded-sm w-full")}>
      <Link
        href={`/servers/${server.id}`}
        className="flex servers-center p-2 space-x-3 rounded-md">
        <div
          className={cn(
            "relative w-16 h-16",
            params.serverId === server.id &&
              "border-8 border-gray-400 dark:bg-gray-500 rounded-full"
          )}>
          <Image
            layout="fill"
            src={server.imageUrl}
            alt={server.name}
            className={cn(
              "rounded-full border-2 border-black dark:border-white hover:shadow-xl transition-all duration-200",
              params.serverId === server.id &&
                "border-gray-400 dark:bg-gray-500 border-4"
            )}
          />
        </div>
      </Link>
    </li>
  );
};

export default NavigationItem;
