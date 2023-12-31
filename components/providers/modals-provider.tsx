"use client";
import { useEffect, useState } from 'react';

import { useModal } from '@/app/hooks/use-modal-store';
import { AddFriendModal } from '@/components/modals/add-friend-modal';
import { BlacklistModal } from '@/components/modals/blacklist-modal';
import { DeleteMessageModal } from '@/components/modals/delete-message-modal';
import { FindDirectMessageModal } from "@/components/modals/find-direct-message-modal";
import { FindFriendshipMessageModal } from "@/components/modals/find-friendship-message-modal";
import { FindMessageModal } from "@/components/modals/find-message-modal";
import { JoinServerModal } from "@/components/modals/join-server-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";

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
      {type === "messageFile" && <MessageFileModal />}
      {type === "deleteMessage" && <DeleteMessageModal />}
      {type === "inviteFriend" && <AddFriendModal />}
      {type === "blacklist" && <BlacklistModal />}
      {type === "joinServer" && <JoinServerModal />}
      {type === "findMessage" && <FindMessageModal />}
      {type === "findDirectMessage" && <FindDirectMessageModal />}
      {type === "findFriendshipMessage" && <FindFriendshipMessageModal />}
    </>
  );
};

export default ModalsProvider;
