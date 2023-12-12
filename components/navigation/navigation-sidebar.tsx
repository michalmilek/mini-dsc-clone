import { redirect } from "next/navigation";
import React from "react";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

import { ModeToggle } from "../mode-toggle";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import NavigationAdd from "./navigation-add";
import NavigationItem from "./navigation-item";

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
    <aside className="fixed inset-y-0 left-0 flex flex-col justify-between  items-center py-3 bg-white dark:bg-black shadow w-32 z-30">
      <div className="flex flex-col w-full">
        <div className="space-y-3">
          <NavigationAdd label="Create server" />

          <div className="flex-1">
            <ScrollArea className="max-h-[500px]">
              <ul className="pt-2 pb-4 space-y-1 text-sm flex flex-col items-center justify-center w-full">
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
