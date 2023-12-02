import { redirect } from "next/navigation";

import { InitiaLmodal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

const page = async () => {
  const profile = await initialProfile();
  if (!profile) {
    return redirect("/sign-up");
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <div>
      <InitiaLmodal />
    </div>
  );
};

export default page;
