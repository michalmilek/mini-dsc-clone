import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    console.log(params.serverId);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Wrong serverId", { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        members: {
          every: {
            profileId: profile.id,
            role: "ADMIN",
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Server doesnt exist", { status: 404 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
