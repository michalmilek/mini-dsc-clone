"use client";

import { Check, Copy, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useGenerateNewServer } from "@/app/services/server/generateNewServer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
  name: string;
}

const schema = z.object({
  name: z.string().min(1),
});

export const InviteModal = () => {
  const { toast } = useToast();
  const { type, isOpen, onClose, data, onOpen } = useModal();
  const { server } = data;

  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (server?.inviteCode) {
      navigator.clipboard.writeText(server.inviteCode);
      setCopied(true);
      toast({
        title: "Invitation link copied to clipboard",
        variant: "success",
      });

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const {
    mutate: generateNewServerFn,
    isPending: isMutatingGenerateNewServer,
  } = useGenerateNewServer();

  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormData) => {
    // trigger(data, {
    //   onSuccess: (result) => {
    //     onClose();
    //     router.refresh();
    //   },
    // });
  };

  const generateNewLink = async () => {
    if (server?.id) {
      generateNewServerFn(
        {
          arg: {
            serverId: server.id,
          },
        },
        {
          onSuccess: (data) => {
            onOpen("invite", { server: data });
          },
        }
      );
    }
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
          <DialogTitle>Invite your friend to a server</DialogTitle>
          <DialogDescription>More people a better party!</DialogDescription>
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
                  <FormDescription>
                    Enter your friend&apos;s nickname
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Or just send him the invitation link</FormLabel>

              <FormControl>
                <div className="flex items-center justify-normal gap-2">
                  <Input value={server?.inviteCode} />
                  <button
                    type="button"
                    onClick={onCopy}>
                    {copied ? <Check /> : <Copy />}
                  </button>
                </div>
              </FormControl>

              <div className="flex items-center justify-normal gap-2 py-4">
                <Button
                  disabled={isMutatingGenerateNewServer}
                  type="button"
                  className="flex items-center gap-2 text-sm"
                  onClick={generateNewLink}>
                  Generate a new link
                  <RefreshCcw
                    className={cn(
                      isMutatingGenerateNewServer && "animate-spin",
                      "text-xs"
                    )}
                  />
                </Button>
              </div>
            </FormItem>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button disabled={isMutating}>Invite</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
