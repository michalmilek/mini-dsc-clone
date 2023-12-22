import {
  Channel,
  DirectMessage,
  FriendshipMessage,
  Member,
  MemberRole,
  Message,
  Profile,
  Reaction,
  ReactionToDirectMessage,
  ReactionToFriendshipMessage,
} from "@prisma/client";

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

export type MessageWithMemberWithReactionsWithProfiles = Message & {
  member: Member & { profile: Profile };
  reactions: ReactionWithProfile[];
};

export type DirectMessageWithMemberWithReactions = DirectMessage & {
  member: MemberWithProfile;
  reactions: ReactionToDirectMessageWithProfile[];
};

export type ReactionWithProfile = Reaction & {
  profile: Profile;
};

export type ReactionToDirectMessageWithProfile = ReactionToDirectMessage & {
  profile: Profile;
};

export type MessageWithFriend = FriendshipMessage & {
  friend: Profile;
  reactions: ReactionToFriendshipMessageWithProfile[];
};

export type ReactionToFriendshipMessageWithProfile =
  ReactionToFriendshipMessage & {
    profile: Profile;
  };

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type FriendshipFriend = Profile;
