"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useDebounce } from "@/app/hooks/use-debounce";
import { useModal } from "@/app/hooks/use-modal-store";
import { useAddFriend } from "@/app/services/user/add-friend";
import { useGetUserManual } from "@/app/services/user/get-profiles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MessageSkeleton from "@/components/utility/message-skeleton";
import NoUsersFound from "@/components/utility/no-users-found";
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
});

export const AddFriendModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const debouncedValue = useDebounce(form.watch("name"), 300);

  const {
    data: usersData,
    error,
    isLoading,
  } = useGetUserManual(debouncedValue);

  const { mutate, isPending } = useAddFriend();

  const onSubmit = (formData: FormData) => {
    mutate(formData.name, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Invitation sent successfully",
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
          <DialogTitle>Add friend</DialogTitle>
          <DialogDescription>
            Welcome! Here you can add new friends to your network. Simply enter
            your friend&apos;s username in the field below. Once they accept
            your friend request, you&apos;ll be able to start sharing messages,
            files, and more. Start growing your network and enjoy more engaging
            conversations!
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
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Insert your friend name or email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading && <MessageSkeleton />}

            {usersData?.length === 0 && <NoUsersFound />}

            {usersData?.length > 0 && (
              <ul className="gap-2 flex flex-col">
                {usersData.map((user: any) => (
                  <li
                    key={user.id + "searchList"}
                    className="w-full dark:hover:bg-gray-700 hover:bg-gray-300 transition-all cursor-pointer">
                    <button
                      onClick={() => {
                        form.setValue("name", user.email);
                      }}
                      className="flex items-center space-x-4 w-full">
                      <div className="h-12 w-12 rounded-full object-cover relative">
                        <Image
                          src={user.imageUrl}
                          alt={user.name}
                          layout="fill"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{user.name}</h3>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div></div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button isLoading={isPending}>Invite</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
