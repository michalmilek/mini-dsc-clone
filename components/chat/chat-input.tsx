"use client";

import { Camera, Paperclip, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useModal } from "@/app/hooks/use-modal-store";
import { useSendMessage } from "@/app/services/chat/sendMessage";
import EmojiPicker from "@/components/chat/emoji-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

interface ChatInputProps {
  apiUrl: string;
  type: "conversation" | "channel";
  name: string;
  query: Record<string, any>;
}

interface FormData {
  content: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query }: ChatInputProps) => {
  const { onOpen } = useModal();
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
      content: "",
    },
  });
  const { mutate } = useSendMessage();

  const onSubmit = (data: FormData) => {
    mutate(
      {
        url: apiUrl,
        arg: {
          body: {
            content: data.content,
          },
          params: {
            ...query,
          },
        },
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const changeValue = (value: string) => {
    const previousValue = watch("content");
    setValue("content", `${previousValue + value}`);
  };

  return (
    <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0 py-4 z-10 bg-secondary">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Write your message!"
            className="w-full rounded-md py-3"
            {...register("content")}
          />
          {errors.content && (
            <div className="absolute left-0 top-full w-full z-50 px-2 ">
              <p className="text-red-500">{errors.content.message}</p>
            </div>
          )}

          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              onClick={() =>
                onOpen("messageFile", {
                  apiUrl: apiUrl,
                  query: query,
                })
              }
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300">
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300">
              <Camera className="h-5 w-5" />
            </button>
            <EmojiPicker onChange={changeValue} />
          </div>
        </div>
        <Button className="inline-flex items-center justify-center px-4 py-3 gap-2">
          <span className="font-bold">Send</span>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
