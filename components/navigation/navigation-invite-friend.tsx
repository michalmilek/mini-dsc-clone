"use client";



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
  const { onOpen } = useModal();

  return (
    <div className="w-full flex items-center justify-center">
      <Button onClick={() => onOpen("inviteFriend")}>Add friend</Button>
    </div>
  );
};

export default NavigationInviteFriend;
