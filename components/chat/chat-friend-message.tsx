"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Check, Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useEditMessage } from "@/app/services/chat/editMessage";
import { MessageWithFriend } from "@/app/types/server";
import ImageModal from "@/components/modals/image-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

interface FormData {
  content: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatFriendMessage = ({
  message,
  isSelf,
  socketUrl,
  chatId,
  socketQuery,
  member,
}: {
  message: MessageWithFriend;
  isSelf: boolean;
  socketUrl: string;
  chatId: string;
  socketQuery: Record<string, string>;
  member: Profile;
}) => {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const { onOpen } = useModal();
  const postDate = new Date(message.createdAt);
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
  const fullDate = format(postDate, "MMMM dd, yyyy HH:mm");
  const isImg = !!message.fileUrl;
  const params = useParams();
  const { mutate } = useEditMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: message.content,
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(
      {
        url: `${socketUrl}/${message.id}`,
        args: {
          params: { ...socketQuery, messageId: message.id },
          content: data.content,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
          setEdit(false);
        },
      }
    );
  };

  if (!params) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-start w-full gap-2 ${
        isSelf ? "flex-row" : "flex-row-reverse"
      }`}>
      <Link href={`/profile/${message.friend.id}`}>
        <div
          className="relative 
        w-12 h-12">
          <Image
            layout="fill"
            src={message.friend.imageUrl}
            alt="Profile"
            className="rounded-full"
          />
        </div>
      </Link>
      <div
        className={`flex flex-col justify-between  ${
          isSelf ? "items-start" : "items-end"
        } w-full`}>
        <div
          className={`flex ${
            isSelf ? "flex-row" : "flex-row-reverse"
          } items-center gap-2`}>
          <span className="text-xl font-bold">{message.friend.name}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-xs italic">{timeAgo}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Posted {timeAgo} ({fullDate})
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isSelf && (
            <>
              {!isImg && (
                <button
                  onClick={() => {
                    setEdit(!edit);
                  }}
                  title="Edit message">
                  <Edit className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => {
                  onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${message.id}`,
                    query: { ...socketQuery, messageId: message.id },
                  });
                }}
                title="Delete message">
                <Trash className="h-4 w-4" />
              </button>
              {message.seen && (
                <span title="Seen">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </>
          )}
        </div>
        {!message.deleted ? (
          <div
            className={`flex ${
              isSelf ? "flex-row" : "flex-row-reverse"
            } w-full`}>
            {isImg ? (
              <ImageModal src={message.content} />
            ) : edit && !isImg ? (
              <form
                className="w-full flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}>
                <Input
                  {...register("content")}
                  className="w-full"
                />
                <Button className="inline-flex items-center justify-center px-4 py-3 gap-2">
                  <span className="font-bold">Confirm</span>
                </Button>
              </form>
            ) : (
              <span className={`px-4 py-2 text-sm`}>{message.content}</span>
            )}
          </div>
        ) : (
          <div className={`flex ${isSelf ? "flex-row" : "flex-row-reverse"}`}>
            <span className={`px-4 py-2 italic text-xs`}>
              Message was deleted
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFriendMessage;
