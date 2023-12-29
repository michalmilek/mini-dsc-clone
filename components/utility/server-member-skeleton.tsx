import { Skeleton } from "@/components/ui/skeleton";

const ServerMemberSkeleton = () => {
  return (
    <div
      className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2"
      key={"loading" + "mobile menu"}>
      <div className="w-full h-full">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Skeleton className="rounded-full h-10 w-10" />
          </div>
          <div className="flex-1 min-w-0">
            <Skeleton className="text-sm font-medium text-gray-900 truncate dark:text-white w-full h-4" />
            <Skeleton className="text-sm text-gray-500 truncate dark:text-gray-400 w-full h-4" />
          </div>
          <div className="hidden items-center text-base text-gray-900 dark:text-white xs:inline-flex">
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerMemberSkeleton;
