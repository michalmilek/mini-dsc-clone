import { cache } from "react";

import { db } from "@/lib/db";

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
