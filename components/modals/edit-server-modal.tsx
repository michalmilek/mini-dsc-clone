"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useEditServer } from "@/app/services/server/editServer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";

import FileUpload from "../file-upload";
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
  imageUrl: string;
}

const schema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url(),
});

export const EditServerModal = () => {
  const { toast } = useToast();
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const { server } = data;
  const { mutate } = useEditServer();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: server?.name,
      imageUrl: server?.imageUrl,
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(
      {
        url: `/api/servers/${server?.id}`,
        arg: data,
      },
      {
        onSuccess: (result) => {
          onClose();
          form.reset();
          router.refresh();
          toast({
            title: "User edited succesfully",
            variant: "success",
          });
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
          <DialogTitle>Customize your server</DialogTitle>
          <DialogDescription>
            Give your server a personality, where every interaction is a
            conversation, not just code.
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
                  <FormDescription>Give your server a name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl className="text-center">
                    <FileUpload
                      endpoint="serverImage"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Give server the avatar</FormDescription>
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
              <Button disabled={isMutating}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
