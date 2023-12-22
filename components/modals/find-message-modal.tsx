"use client";

import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import useAsync from "@/app/hooks/use-async";
import { useModal } from "@/app/hooks/use-modal-store";
import { searchForMessage } from "@/app/services/chat/searchForMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";

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
  message: string;
}

const schema = z.object({
  message: z.string().min(1),
});

export const FindMessageModal = () => {
  const { toast } = useToast();
  const { type, isOpen, onClose, data, onOpen } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const { execute, error, value, status } = useAsync(searchForMessage);
  console.log("🚀 ~ value:", value);

  const [copied, setCopied] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    execute(data.message);
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
          <DialogTitle>Find a message</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the part of the message you are looking for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {value && value.length > 0 && (
              <ScrollArea className="max-h-[450px] !overflow-y-auto">
                <ul>
                  {value.map((message) => (
                    <li
                      className=" hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 rounded-md cursor-pointer"
                      key={message.id + "search message"}>
                      <button
                        className="flex w-full justify-between items-center"
                        onClick={() => {
                          router.replace(`${pathname}?messageId=${message.id}`);
                          onClose();
                        }}>
                        <div>
                          <p>{message.content}</p>
                          <p className="text-xs italic">
                            {format(
                              new Date(message.createdAt),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </p>
                        </div>
                        <Avatar>
                          <AvatarImage
                            src={message.member.profile.imageUrl}
                            alt={message.member.profile.name}
                          />
                          <AvatarFallback>
                            {message.member.profile.name}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}

            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button>Go to</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
