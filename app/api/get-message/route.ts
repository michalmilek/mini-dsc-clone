import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { query: string } }
) {
  try {
    const { query } = params;

    if (!query) {
      return new NextResponse("Invalid query", { status: 400 });
    }

    const users = await db.message.findMany({
      where: {
        content: {
          contains: query,
        },
      },
      take: 5,
    });

    return NextResponse.json(users || []);
  } catch (error) {
    console.log("Error in get-profiles route: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
