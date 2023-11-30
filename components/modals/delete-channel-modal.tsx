"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useModal } from "@/app/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { useToast } from "../ui/use-toast";
import { deleteChannel } from "@/app/services/server/deleteChannel";

export const DeleteChannelModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const { trigger, isMutating } = useSWRMutation(
    `/api/servers/${data.channel?.serverId}/delete-channel/${data.channel?.id}`,
    deleteChannel
  );

  if (!data.server && !data.channel) {
    return null;
  }

  const onClick = () => {
    trigger(undefined, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: `You've successfully deleted ${data.channel?.name} channel`,
        });
        router.push(`/servers/${data.channel?.serverId}`);
        router.refresh();
        onClose();
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
            onClick={onClick}
            className="w-full sm:w-[50%]">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
