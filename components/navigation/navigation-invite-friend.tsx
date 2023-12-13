"use client";

import { useEffect, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";

import { Button } from "../ui/button";

interface Props {
  label?: string;
  /* children: React.ReactNode; */
  /*   side?: "top" | "right" | "left" | "center";
  align?: "start" | "center" | "end"; */
}

/*       <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{label}</TooltipTrigger>
          <TooltipContent></TooltipContent>
        </Tooltip>
      </TooltipProvider>; */

const NavigationInviteFriend = ({ label }: Props) => {
  const [mounted, setMounted] = useState(false);
  const { onOpen } = useModal();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Button onClick={() => onOpen("inviteFriend")}>Add friend</Button>
    </div>
  );
};

export default NavigationInviteFriend;
