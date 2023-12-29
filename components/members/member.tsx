"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";
import { useChangeRole } from "@/app/services/server/changeRole";
import { useDeleteUser } from "@/app/services/server/deleteUser";
import GlobalLoader from "@/components/ui/global-loader";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

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

  const { mutate: deleteUserFn, isPending: isMutatingDeleteUser } =
    useDeleteUser();

  const { mutate, isPending } = useChangeRole();

  const [value, setValue] = useState(role.toLowerCase());

  return (
    <>
      {isPending && <GlobalLoader />}
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
            mutate(
              {
                url: `/api/servers/${serverId}/change-role`,
                arg: {
                  body: {
                    role: changedValue.toUpperCase() as "GUEST" | "MODERATOR",
                  },
                  params: {
                    memberId,
                  },
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
          isLoading={isMutatingDeleteUser}
          onClick={() => {
            deleteUserFn(
              {
                url: `/api/servers/${serverId}/delete-user`,
                arg: {
                  params: {
                    memberId,
                  },
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
    </>
  );
};

export default Member;
