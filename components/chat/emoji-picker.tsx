"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300">
        <Smile className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}>
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
