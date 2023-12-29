import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ChatMessageSkeleton = ({ isSelf = true }: { isSelf?: boolean }) => {
  return (
    <div
      className={cn(
        `flex items-center gap-2 w-full`,
        !isSelf &&
          `flex-row-reverse
 justify-end`,
        isSelf && "flex-row justify-start"
      )}>
      <Skeleton className="w-10 h-10 rounded-full" />
      <div
        className={cn(
          "flex flex-col justify-between gap-2 w-full",
          !isSelf && "items-end",
          isSelf && "items-start"
        )}>
        <div className="flex items-center justify-center gap-1">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-8 h-6" />
          <Skeleton className="w-12 h-6" />
          <Skeleton className="w-4 h-6" />
          <Skeleton className="w-4 h-6" />
          <Skeleton className="w-4 h-6" />
        </div>
        <Skeleton className="w-full h-6" />
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;
