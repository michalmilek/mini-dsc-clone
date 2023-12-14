"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useBlockUser } from "@/app/services/user/block-user";
import { useGetUserManual } from "@/app/services/user/get-profiles";
import { useUnblockUser } from "@/app/services/user/unblock-user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChannelType, Profile } from "@prisma/client";

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

export const BlacklistModal = () => {
  const { type, isOpen, onOpen, onClose, data } = useModal();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const {
    data: usersData,
    error,
    isLoading,
  } = useGetUserManual(form.watch("name"));

  const { mutate } = useBlockUser();
  const { mutate: unblockUser } = useUnblockUser();

  const onSubmit = (formData: FormData) => {
    mutate(formData.name, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "User has been added to your blacklist successfully",
        });
        onOpen("blacklist", {
          blacklist: filteredData,
        });
      },
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const filteredList = data?.blacklist?.filter(
    (blacklistUser) => user?.imageUrl !== blacklistUser.imageUrl
  );

  const filteredData = usersData?.filter((item: Profile) => {
    const blacklistUserIds = filteredList?.map(
      (blacklistUser) => blacklistUser.id
    );
    return !blacklistUserIds?.includes(item.id);
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Blacklist</DialogTitle>
          <DialogDescription>
            Place where you can see all your blacklisted users
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
                  <FormDescription>Find user by name or email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {filteredData && filteredData?.length > 0 && (
              <>
                <h3 className="text-lg font-medium">Found users</h3>
                <ul className="gap-2 flex flex-col">
                  {filteredData.map((user: any) => (
                    <li
                      key={user.id + "searchList"}
                      className="w-full dark:hover:bg-gray-700 hover:bg-gray-300 transition-all cursor-pointer">
                      <button
                        type="button"
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
              </>
            )}
            {filteredList && filteredList?.length > 0 && (
              <>
                <h3 className="text-lg font-medium">Blacklisted users</h3>
                <ul className="gap-2 flex flex-col">
                  {filteredList.map((user: any) => (
                    <li
                      key={user.id + "searchList"}
                      className="w-full dark:hover:bg-gray-700 hover:bg-gray-300 transition-all cursor-pointer flex items-center justify-between">
                      <div className="flex items-center space-x-4 w-full">
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
                      </div>
                      <Button
                        type="button"
                        onClick={() =>
                          unblockUser(user.id, {
                            onSuccess: () => {
                              toast({
                                variant: "success",
                                title:
                                  "User has been removed from blacklist successfully",
                              });
                              onOpen("blacklist", {
                                blacklist: filteredList.filter(
                                  (item) => item.id !== user.id
                                ),
                              });
                            },
                          })
                        }
                        variant={"destructive"}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                variant={"destructive"}>
                Close
              </Button>
              <Button type="submit">Block</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
