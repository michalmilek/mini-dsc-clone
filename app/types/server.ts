import { Channel, Member, MemberRole, Message, Profile } from "@prisma/client";

export interface NewServerRequest {
  name: string;
  imageUrl: string | undefined;
}

export interface ServerWithMembersAndChannels {
  channels: Channel[];
  createdAt: Date;
  id: string;
  imageUrl: string;
  inviteCode: string;
  members: CustomMember[];
  name: string;
  profileId: string;
  updatedAt: Date;
}

export interface CustomMember {
  profile: {
    createdAt: Date;
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    updatedAt: Date;
  };
  createdAt: Date;
  id: string;
  profileId: string;
  role: string;
  serverId: string;
  updatedAt: Date;
}

export type ChannelType = "TEXT" | "AUDIO" | "VIDEO";

export interface ChannelRequest {
  name: string;
  type: ChannelType;
}

export interface MemberChat {
  profile: {
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  id: string;
  role: MemberRole;
  profileId: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageWithMember = Message & {
  member: Member & { profile: Profile };
};

export interface FriendshipFriend {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
