"use client";

import { Check, ClipboardPaste } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { revalidateLayout } from '@/app/actions/revalidateLayout';
import useAsync from '@/app/hooks/use-async';
import { useModal } from '@/app/hooks/use-modal-store';
import { joinServer } from '@/app/services/server/joinServer';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

interface FormData {
  code: string;
}

const schema = z.object({
  code: z.string().min(1),
});

export const JoinServerModal = () => {
  const { toast } = useToast();
  const { type, isOpen, onClose, data, onOpen } = useModal();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });
  const { execute, status, error } = useAsync(joinServer);

  //const { server } = data;

  const [copied, setCopied] = useState(false);

  const onPaste = async () => {
    form.setValue("code", await navigator.clipboard.readText());
    setCopied(true);
    toast({
      title: "Invitation link pasted!",
      variant: "success",
    });

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onSubmit = (data: FormData) => {
    execute(data.code);
  };

  useEffect(() => {
    if (status === "success") {
      onClose();
      toast({
        title: "You joined the server!",
        variant: "success",
      });
      revalidateLayout();
    }

    if (status === "error") {
      toast({
        title: "Something went wrong!",
        description: error!.stack,
        variant: "destructive",
      });
    }
  }, [onClose, status, toast, error]);

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
          <DialogTitle>Join to a server modal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Paste here the invitation code or press the button below to
                    paste from the clipboard
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={onPaste}
              type="button">
              {copied ? <Check /> : <ClipboardPaste />}
            </Button>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button>Join</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
