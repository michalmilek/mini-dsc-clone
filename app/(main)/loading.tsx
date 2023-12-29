import { Skeleton } from "@/components/ui/skeleton";
import ServerSkeleton from "@/components/utility/server-skeleton";

const MainLoading = () => {
  return (
    <>
      <Skeleton className="block w-32 inset-y-0 z-30 fixed left-0" />
      <div className="flex w-full h-full items-center flex-col pl-32">
        <div className="flex flex-col items-center justify-center w-full h-full pt-4 ">
          <h2 className="text-2xl font-bold">Welcome to Discord</h2>
        </div>
        <div className="flex w-full h-full flex-col items-center justify-center pt-4">
          <h2 className="font-bold text-lg">Servers</h2>
          <div className="flex flex-col gap-2 w-full">
            <ServerSkeleton />
            <ServerSkeleton />
            <ServerSkeleton />
          </div>

          <>
            <h2 className="font-bold text-lg">Friends</h2>
            <div className="flex flex-col gap-2 w-full">
              <ServerSkeleton />
              <ServerSkeleton />
              <ServerSkeleton />
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default MainLoading;
