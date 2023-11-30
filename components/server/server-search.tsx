"use client";

import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export default function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }

    if (type === "channel") {
      return router.push(`/servers${params?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <div className="flex gap-2 w-full justify-between items-center px-4">
        <span className="flex items-center gap-2 text-sm text-muted-foreground text-center">
          Search
          <Search className=" text-gray-500 left-3" />
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data?.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup
                key={label}
                heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      onSelect={() => onClick({ id, type })}
                      key={id}>
                      {React.cloneElement(icon as JSX.Element, {
                        className: "mr-2 h-4 w-4",
                      })}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}

//   const [open, setOpen] = useState(false);
//   return (
//     <div className="relative">
//       <Search className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3" />
//       <Input
//         type="text"
//         placeholder="Search"
//         className="pl-12 pr-4"
//       />
//     </div>
