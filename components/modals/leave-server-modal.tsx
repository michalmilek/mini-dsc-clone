"use client";

import { useRouter } from "next/navigation";
import * as z from "zod";

import { revalidateLayout } from "@/app/actions/revalidateLayout";
import { useModal } from "@/app/hooks/use-modal-store";
import { useLeaveServer } from "@/app/services/server/leaveServer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChannelType } from "@prisma/client";

import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface FormData {
  name: string;
  type: ChannelType;
}

const schema = z.object({
  name: z.string().min(1),
  type: z
    .string()
    .refine(
      (value) => ["TEXT", "AUDIO", "VIDEO"].includes(value),
      "Type must be one of: TEXT, AUDIO, or VIDEO"
    ),
});

export const LeaveServerModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const { mutate } = useLeaveServer();

  const onClick = () => {
    mutate(`/api/servers/${data.server?.id}/leave-server`, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: `You successfully leaved ${res.name}`,
        });
        onClose();
        router.push("/");
        revalidateLayout();
      },
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to leave us?</DialogTitle>
          <DialogDescription>
            Friends will be sad to see you leave us. 😥
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            className="w-full sm:w-[50%]"
            type="button"
            onClick={handleClose}
            variant={"destructive"}>
            Close
          </Button>
          <Button
            onClick={onClick}
            className="w-full sm:w-[50%]">
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
