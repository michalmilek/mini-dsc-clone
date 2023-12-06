"use client";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const ImageModal = ({ src }: { src: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-40 h-40 relative">
          <Image
            layout="fill"
            src={src}
            alt="message"
            className=" border-2 border-gray-800 dark:border-gray-200 order-2 object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="h-[80vh] w-[80vw]">
        <DialogHeader>
          <DialogDescription className="h-full">
            <div className="w-full h-full relative mt-4">
              <Image
                layout="fill"
                src={src}
                alt="message dialog"
                className="border-2 border-gray-800 dark:border-gray-200 order-2 object-cover"
              />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
