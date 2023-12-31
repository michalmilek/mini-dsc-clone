"use client";

import "@livekit/components-styles";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";
import { useGetMedia } from "@/app/services/chat/getMedia";
import {
  AudioConference,
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

interface MediaRoomProps {
  chatId: string;
}

export const ChatFriendshipMediaRoom = ({ chatId }: MediaRoomProps) => {
  const { data, isSuccess } = useGetMedia({ chatId });
  const { data: callData } = useModal();
  const [token, setToken] = useState<string>("");
  const { onClose, isOpen } = useModal();

  useEffect(() => {
    if (isSuccess) {
      setToken(data.token);
    }

    return () => {
      setToken("");
      onClose();
    };
  }, [isSuccess, data, onClose]);

  if (!isOpen) {
    return null;
  }

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full w-full absolute z-50 bg-background/25 backdrop-blur-sm">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!callData.callData?.audio && !callData.callData?.video) {
    return null;
  }

  if (isOpen) {
    return (
      <div className="absolute h-full w-full top-0 left-0">
        <LiveKitRoom
          video={!callData.callData?.video}
          audio={callData.callData?.audio}
          token={token}
          onDisconnected={() => onClose()}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: "100%", zIndex: 1000 }}>
          {callData.callData?.video ? (
            <VideoConference />
          ) : (
            <div className="flex flex-col h-[80%] w-full items-center justify-between">
              <AudioConference />
            </div>
          )}
        </LiveKitRoom>
      </div>
    );
  }

  return null;
};
