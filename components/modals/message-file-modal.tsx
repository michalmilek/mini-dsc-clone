"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useMessageFileUpload } from "@/app/services/chat/messageFileUpload";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface FormData {
  fileUrl: string;
}

const schema = z.object({
  fileUrl: z.string().url(),
});

export const MessageFileModal = () => {
  const { onClose, isOpen, data } = useModal();
  const [isLoaded, setIsLoaded] = useState(false);
  const { mutate } = useMessageFileUpload();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const onSubmit = (formData: FormData) => {
    mutate(
      {
        url: data.apiUrl || "",
        arg: {
          body: {
            fileUrl: formData.fileUrl,
            content: formData.fileUrl,
          },
          params: {
            ...data.query,
          },
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
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
          <DialogTitle>Attach a file</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl className="text-center">
                    <FileUpload
                      endpoint="messageFile"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Upload your photo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant={"destructive"}
                onClick={onClose}
                type="button">
                Cancel
              </Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
