"use client";

import * as z from "zod";

interface ChatInputProps {
  apiUrl: string;
  type: "conversation" | "channel";
  name: string;
  query: Record<string, any>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  return <div>ChatInput</div>;
};

export default ChatInput;
