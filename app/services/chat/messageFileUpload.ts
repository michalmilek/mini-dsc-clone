import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface MessageFileUploadRequest {
  body: {
    fileUrl: string;
    content: string;
  };
  params: Record<string, any>;
}

export function useMessageFileUpload() {
  const messageFileUpload = async ({
    url,
    arg,
  }: {
    url: string;
    arg: MessageFileUploadRequest;
  }) => {
    return axios
      .post(url, arg.body, { params: arg.params })
      .then((res) => res.data);
  };

  return useMutation({ mutationFn: messageFileUpload });
}
