"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/app/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import { createChannel } from "@/app/services/server/createChannel";
import { useToast } from "../ui/use-toast";
import { leaveServer } from "@/app/services/server/leaveServer";
import { deleteServer } from "@/app/services/server/deleteServer";

export const DeleteServerModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const { trigger, isMutating } = useSWRMutation(
    `/api/servers/${data.server?.id}/delete-server`,
    deleteServer
  );

  const onClick = () => {
    trigger(undefined, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: `You've successfully deleted ${res.name}`,
        });
        router.refresh();
        router.push("/");
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
            Are you sure you want to delete {data.server?.name}?
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this communication source?
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
