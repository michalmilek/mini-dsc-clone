import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
  return (
    <div className="hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 rounded-md cursor-pointer">
      <div className="flex w-full justify-between items-center">
        <div>
          <Skeleton className="w-[200px] h-5" />{" "}
          <Skeleton className="w-[100px] h-5" />
        </div>

        <Skeleton className="w-[50px] h-[50px] rounded-full" />
      </div>
    </div>
  );
};

export default MessageSkeleton;
