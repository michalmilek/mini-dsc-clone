import { Skeleton } from "@/components/ui/skeleton";
import ServerMemberSkeleton from "@/components/utility/server-member-skeleton";
import ServerSkeleton from "@/components/utility/server-skeleton";

const ServerLoading = () => {
  return (
    <>
      <Skeleton className="block w-32 inset-y-0 z-20 fixed left-0" />
      <div className="flex flex-col items-center pl-32 justify-center w-full h-full">
        <div className="flex flex-col items-center justify-start gap-3 w-full h-full p-3 ">
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <Skeleton className="h-6 w-full" />

            <h3 className="text-xl">Channels</h3>
          </div>
          <ServerSkeleton />
          <ServerSkeleton />
          <ServerSkeleton />
        </div>

        <div className="flex flex-col items-center justify-center w-full h-full">
          <h3 className="text-xl">Members</h3>
          <ServerMemberSkeleton />
          <ServerMemberSkeleton />
          <ServerMemberSkeleton />
        </div>
      </div>
    </>
  );
};

export default ServerLoading;
