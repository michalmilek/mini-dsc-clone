"use client";

import React, { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import useSWRMutation from "swr/mutation";
import { changeRole } from "@/app/services/server/changeRole";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/services/server/deleteUser";
import { useModal } from "@/app/hooks/use-modal-store";

interface UserInfoProps {
  name: string;
  email: string;
  role: string;
  imgSrc: string;
  serverId: string;
  memberId: string;
}

const Member: FC<UserInfoProps> = ({
  name,
  email,
  role,
  imgSrc,
  serverId,
  memberId,
}) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const { trigger, isMutating } = useSWRMutation(
    `/api/servers/${serverId}/change-role`,
    changeRole
  );
  const { trigger: deleteUserFn, isMutating: isMutatingDeleteUser } =
    useSWRMutation(`/api/servers/${serverId}/delete-user`, deleteUser);

  const [value, setValue] = useState(role.toLowerCase());

  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={imgSrc} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>
      <Select
        onValueChange={(changedValue) => {
          setValue(changedValue);
          trigger(
            {
              body: {
                role: changedValue.toUpperCase() as "GUEST" | "MODERATOR",
              },
              params: {
                memberId,
              },
            },
            {
              onSuccess: (response) => {
                toast({
                  title: "Role changed succesfully",
                  variant: "success",
                });
                router.refresh();
                onOpen("members", { server: response });
              },
              onError: () => {
                toast({
                  title: "Something went wrong",
                  variant: "destructive",
                });
              },
            }
          );
        }}
        defaultValue={value}>
        <SelectTrigger className="ml-auto w-[110px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="guest">Guest</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          deleteUserFn(
            {
              params: {
                memberId,
              },
            },
            {
              onSuccess: () => {
                router.refresh();
                onOpen("members");
              },
              onError: () => {
                toast({
                  title: "Something went wrong",
                  variant: "destructive",
                });
              },
            }
          );
        }}
        variant={"destructive"}>
        <Trash />
      </Button>
    </div>
  );
};

export default Member;
