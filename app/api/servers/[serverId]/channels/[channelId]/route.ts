import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          every: {
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
