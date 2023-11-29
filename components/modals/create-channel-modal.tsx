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

export const CreateChannelModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    `/api/servers/${data.server?.id}/channels`,
    createChannel
  );

  const onSubmit = (data: FormData) => {
    trigger(data, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Channel created successfully",
        });
        router.refresh();
        handleClose();
      },
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create channel</DialogTitle>
          <DialogDescription>
            Welcome! Here you can create a new channel to easily communicate
            with other users. Choose a unique name for your channel that clearly
            describes its subject matter. Once you have created a channel, you
            will be able to invite other users to join and start sharing
            information, ideas or files.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Give your channel a name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select channel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="AUDIO">Audio</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a type for your channel
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
