import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { serverId: string; channelId: string } }
) {
  try {
    const profile = await currentProfile();
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
          delete: {
            id: channelId,
            NOT: {
              name: "general",
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
