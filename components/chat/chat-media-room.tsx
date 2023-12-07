"use client";

// CSS should be explicitly imported if using the default UI
import "@livekit/components-styles";

import {
  AudioConference,
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useGetMedia } from "@/app/services/chat/getMedia";
import { Button } from "@/components/ui/button";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const ChatMediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { data, isSuccess } = useGetMedia({ chatId });
  const [token, setToken] = useState<string | null>("");

  useEffect(() => {
    if (isSuccess) {
      setToken(data.token);
    }

    return () => {
      setToken("");
    };
  }, [isSuccess, data]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full w-full absolute z-50 bg-background/25 backdrop-blur-sm">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (token === null) {
    return <Button onClick={() => setToken(data.token)}>Reconnect</Button>;
  }

  return (
    <div className="absolute h-full w-full top-0 left-0">
      <LiveKitRoom
        video={video}
        audio={audio}
        token={token}
        onDisconnected={() => setToken(null)}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100%", zIndex: 1000 }}>
        {video ? (
          <VideoConference />
        ) : (
          <div className="flex flex-col h-[80%] w-full items-center justify-between">
            <AudioConference />
          </div>
        )}
      </LiveKitRoom>
    </div>
  );
};
