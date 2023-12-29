import { Member, Message } from "@prisma/client";

export type MessageWithMember = Message & {
  member: Member;
};
