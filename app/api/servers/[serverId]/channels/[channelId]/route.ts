import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string; channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { type, name } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.channelId || !params.serverId) {
      return new NextResponse("ChannelId or serverId doesnt exist", {
        status: 400,
      });
    }

    const { serverId, channelId } = params;

    const memberRole = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            NOT: [
              {
                role: "GUEST",
              },
            ],
          },
        },
      },
    });

    if (!memberRole) {
      return new NextResponse("Not allowed", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: "ADMIN" || "MODERATOR",
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[DELETE_CHANNEL_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
