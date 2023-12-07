import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface MessageFileUploadRequest {
  body: {
    fileUrl: string;
    content: string;
  };
  params: Record<string, any>;
}

export function useGetMedia({ chatId }: { chatId: string }) {
  const { user } = useUser();
  const getMedia = async () => {
    try {
      if (!user) {
        return;
      }
      const name = `${user.firstName} ${user.lastName}`;
      const resp = await axios.get(
        `/api/get-participant-token?room=${chatId}&username=${name}`
      );
      return resp.data;
    } catch (e) {
      console.log(e);
    }
  };

  return useQuery({ queryFn: getMedia, queryKey: ["media", chatId] });
}
