import { db } from "@/lib/db";
import { cache } from "react";

export const getUserServers = cache(async (profileId: string) => {
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId,
        },
      },
    },
  });

  return servers;
});
