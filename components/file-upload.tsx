"use client";
import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { Button } from "./ui/button";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <div className="relative h-32 w-32">
          <Image
            fill
            src={value}
            alt="Upload"
            className="rounded-full border-2 border-black shadow-2xl"
          />
        </div>
        <Button
          title={"Remove photo"}
          type="button"
          className="relative p-1 px-2"
          onClick={() => onChange("")}>
          Delete photo
        </Button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
