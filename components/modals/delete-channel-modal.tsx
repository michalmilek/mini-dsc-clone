"use client";

import { useRouter } from "next/navigation";

import { useModal } from "@/app/hooks/use-modal-store";
import { useDeleteChannel } from "@/app/services/server/deleteChannel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export const DeleteChannelModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const { mutate, isPending } = useDeleteChannel();

  if (!data.server && !data.channel) {
    return null;
  }

  const onClick = () => {
    mutate(
      `/api/servers/${data.channel?.serverId}/delete-channel/${data.channel?.id}`,
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: `You've successfully deleted ${data.channel?.name} channel`,
          });
          router.push(`/servers/${data.channel?.serverId}`);
          router.refresh();
          onClose();
        },
      }
    );
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
          <DialogTitle>
            Are you sure you want to delete {data.channel?.name} channel?
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this channel?
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
            isLoading={isPending}
            onClick={onClick}
            className="w-full sm:w-[50%]">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
