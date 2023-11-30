import { Channel } from "@prisma/client";
import { Bell, Search } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const ServerHeader = ({ channel }: { channel: Channel }) => {
  return (
    <header className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-3">
                {channel.name}
              </span>
            </div>
            <span className="text-lg  text-gray-600 dark:text-gray-400">
              {channel.type}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg  text-gray-600 dark:text-gray-400">
            Created at: {channel.createdAt.toLocaleDateString()}
          </span>
          <Button type="button">
            <Search />
          </Button>
          <Button type="button">
            <Bell />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ServerHeader;
