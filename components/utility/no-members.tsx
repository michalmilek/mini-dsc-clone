"use client";

import { useModal } from "@/app/hooks/use-modal-store";
import { ServerWithChannelsAndMembersWithProfiles } from "@/app/types/server";
import { Button } from "@/components/ui/button";

export default function NoMembers({
  server,
}: {
  server: ServerWithChannelsAndMembersWithProfiles;
}) {
  console.log("🚀 ~ server:", server);
  const { onOpen } = useModal();
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <p>There are no members besides you.</p>
      <Button onClick={() => onOpen("invite", { server })}>Add first</Button>
    </div>
  );
}
