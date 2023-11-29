import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { serverId: string };
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const memberId = searchParams.get("memberId");
    if (!memberId) {
      return new NextResponse("MemberId not found", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const serverRole = await db.server.findUnique({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: "GUEST",
          },
        },
      },
    });

    if (serverRole) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
      },
      data: {
        members: {
          delete: {
            id: memberId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            updatedAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
