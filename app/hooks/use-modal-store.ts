import { create } from 'zustand';

import { Channel, ChannelType, Profile, Server } from '@prisma/client';

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage"
  | "calls"
  | "inviteFriend"
  | "blacklist"
  | "joinServer"
  | "findMessage"
  | "findDirectMessage"
  | "findFriendshipMessage";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
  callData?: {
    audio: boolean;
    video: boolean;
  };
  blacklist?: Profile[];
  chatId?: string;
  chatType?: "serverConversation" | "friendship" | "channel";
  messageId?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
