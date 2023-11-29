import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const serverRole = await db.server.findUnique({
      where: {
        id: params.serverId,
      },
      include: {
        members: true,
      },
    });

    if (!serverRole) {
      return new NextResponse("Server with provided ID doesnt exist", {
        status: 404,
      });
    }

    if (
      serverRole?.members.find((user) => user.profileId === profile.id)
        ?.role === "GUEST"
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
