"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useEditChannel } from "@/app/services/server/editChannel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType } from "@prisma/client";

import { Button } from "../ui/button";
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

export const EditChannelModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.channel?.name,
      type: data.channel?.type,
    },
  });

  const { mutate } = useEditChannel();

  const onSubmit = (formData: FormData) => {
    mutate(
      {
        url: `/api/servers/${data.channel?.serverId}/channels/${data.channel?.id}`,
        arg: formData,
      },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: `Channel with name ${formData.name} edited successfully`,
          });
          router.refresh();
          handleClose();
        },
      }
    );
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
          <DialogTitle>Edit channel</DialogTitle>
          <DialogDescription>Edit your channel</DialogDescription>
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
              <Button>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
