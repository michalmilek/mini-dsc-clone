import { toast } from "@/components/ui/use-toast";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  if (!params.inviteCode) {
    toast({
      variant: "destructive",
      title:
        "Wrong invitation code is wrong or just expired. Try again with different code.",
    });
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    toast({
      variant: "destructive",
      title: "You're already member of this server.",
    });
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  return <div>InvitePage</div>;
};

export default InvitePage;
