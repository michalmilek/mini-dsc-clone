import Image from "next/image";
import Link from "next/link";

import { Profile } from "@prisma/client";

// friendOne;
// friendTwo;
// directMessagesBetweenFriends;

const MainPageFriendship = ({
  friend,
  amountOfUnreadMessages,
  friendshipId,
}: {
  friendshipId: string;
  friend: Profile;
  amountOfUnreadMessages: number;
}) => {
  return (
    <li className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2">
      <Link
        href={`/friendship/${friendshipId}`}
        className="w-full h-full">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 h-10 w-10 relative">
            {amountOfUnreadMessages > 0 && (
              <span className="absolute z-10 top-0 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                {amountOfUnreadMessages}
              </span>
            )}
            <Image
              src={friend.imageUrl}
              alt={friend.name}
              fill
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {friend.name}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {friend.email}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default MainPageFriendship;
