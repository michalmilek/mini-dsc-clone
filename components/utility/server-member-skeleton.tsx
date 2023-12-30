import { Skeleton } from "@/components/ui/skeleton";

const ServerMemberSkeleton = () => {
  return (
    <div
      className="transition-all cursor-pointer p-2 w-full space-y-2"
      key={"loading" + "mobile menu"}>
      <div className="w-full h-full">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Skeleton className="rounded-full h-10 w-10" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className="hidden items-center text-base xs:inline-flex">
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerMemberSkeleton;
