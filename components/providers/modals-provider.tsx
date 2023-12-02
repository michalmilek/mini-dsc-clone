"use client";
import { useEffect, useState } from "react";

import { useModal } from "@/app/hooks/use-modal-store";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateServerModal } from "../modals/create-server-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { EditServerModal } from "../modals/edit-server-modal";
import { InviteModal } from "../modals/invite-modal";
import { LeaveServerModal } from "../modals/leave-server-modal";
import { MembersModal } from "../modals/members-modal";

const ModalsProvider = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { type } = useModal();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }
  return (
    <>
      {type === "createServer" && <CreateServerModal />}
      {type === "invite" && <InviteModal />}
      {type === "editServer" && <EditServerModal />}
      {type === "members" && <MembersModal />}
      {type === "createChannel" && <CreateChannelModal />}
      {type === "leaveServer" && <LeaveServerModal />}
      {type === "deleteServer" && <DeleteServerModal />}
      {type === "deleteChannel" && <DeleteChannelModal />}
      {type === "editChannel" && <EditChannelModal />}
    </>
  );
};

export default ModalsProvider;
