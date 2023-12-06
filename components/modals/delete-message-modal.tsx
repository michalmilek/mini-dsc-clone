"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useModal } from "@/app/hooks/use-modal-store";
import { useDeleteMessage } from "@/app/services/chat/deleteMessage";
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

export const DeleteMessageModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate } = useDeleteMessage();

  const onClick = () => {
    if (data.query) {
      mutate(
        {
          url: data.apiUrl || "",
          args: {
            params: {
              ...data.query,
            },
          },
        },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              title: `You've successfully deleted message`,
            });
            queryClient.invalidateQueries({
              queryKey: ["messages"],
            });
            onClose();
          },
        }
      );
    }
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
          <DialogTitle>Delete message</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this message?
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
