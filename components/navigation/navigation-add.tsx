"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useModal } from "@/app/hooks/use-modal-store";

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

const NavigationAdd = ({ label }: Props) => {
  const { onOpen } = useModal();

  return (
    <div className="w-full flex items-center justify-center">
      <Button onClick={() => onOpen("createServer")}>
        <Plus />
      </Button>
    </div>
  );
};

export default NavigationAdd;
