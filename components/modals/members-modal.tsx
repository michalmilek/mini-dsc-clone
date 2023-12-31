"use client";

import { useEffect, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";
import { ServerWithMembersAndChannels } from "@/app/types/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Members from "../members/members";
import { Button } from "../ui/button";

export const MembersModal = () => {
  const { data, onClose } = useModal();
  const { server } = data as { server: ServerWithMembersAndChannels };
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={onClose}
      open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Members settings</DialogTitle>
          <DialogDescription>
            Would you like to remove someone? 😎
          </DialogDescription>
        </DialogHeader>
        <Members server={server} />
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={() => onClose()}>
            Close
          </Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
