"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useCreateNewServer } from "@/app/services/server/createServer";
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

interface FormData {
  name: string;
  imageUrl: string;
}

const schema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url(),
});

export const Initialmodal = () => {
  const router = useRouter();
  const { onClose, isOpen } = useModal();
  const { mutate, isPending } = useCreateNewServer();
  const [isLoaded, setIsLoaded] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        router.refresh();
        onClose();
      },
    });
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={onClose}
      open={isOpen}>
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
                onClick={onClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button isLoading={isPending}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
