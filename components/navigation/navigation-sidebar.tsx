import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import NavigationAdd from "./navigation-add";
import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import NavigationItem from "./navigation-item";
import { UserButton, UserProfile } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col justify-between  items-center p-3 bg-white dark:bg-black shadow w-32 z-30">
      <div className="flex flex-col">
        <div className="space-y-3">
          <div className="flex items-center w-full justify-center">
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>
          <NavigationAdd label="Create server" />

          <div className="flex-1">
            <ScrollArea className="max-h-[500px] z-50">
              <ul className="pt-2 pb-4 space-y-1 text-sm flex flex-col items-center overflow-y-scroll max-h-[500px]">
                {servers.map((item, index) => (
                  <React.Fragment key={item.id + " server"}>
                    <NavigationItem server={item} />
                    {index !== servers.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-col space-y-3">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
};

export default NavigationSidebar;
