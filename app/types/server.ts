import { Channel, Member } from "@prisma/client";

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
