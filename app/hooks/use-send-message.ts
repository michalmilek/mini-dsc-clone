import { create } from "zustand";

interface SendMessageInterface {
  isSent: boolean;
  setSentTrue: () => void;
  setSentFalse: () => void;
}

export const useSendMessageHook = create<SendMessageInterface>((set) => ({
  isSent: false,
  setSentTrue: () => set({ isSent: true }),
  setSentFalse: () => set({ isSent: false }),
}));
