"use server";

import { db } from "@/lib/db";

export const searchForMessage = async (query: string) => {
  const messages = await db.message.findMany({
    where: {
      content: {
        contains: query,
      },
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });

  return messages;
};
