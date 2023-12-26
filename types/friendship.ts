import { FriendshipMessage } from "@prisma/client";

interface Friend {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friendship {
  id: string;
  friendOneId: string;
  friendTwoId: string;
  createdAt: Date;
  updatedAt: Date;
  friendOne: Friend;
  friendTwo: Friend;
  directMessagesBetweenFriends: FriendshipMessage[];
}

export interface FriendshipWithFriends {
  id: string;
  friendOneId: string;
  friendTwoId: string;
  createdAt: Date;
  updatedAt: Date;
  friendOne: Friend;
  friendTwo: Friend;
}
