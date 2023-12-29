import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { Member, Profile } from "@prisma/client";

const ServerPageMember = ({
  member,
}: {
  member: Member & { profile: Profile };
}) => {
  return (
    <li
      className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-all cursor-pointer p-2"
      key={member.id + "mobile menu"}>
      <Link
        href={`/servers/${member.serverId}/conversations/${member.profile.id}`}
        className="w-full h-full">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Image
              fill
              alt={member.profile.name}
              src={member.profile.imageUrl}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {member.profile.name}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {member.role}
            </p>
          </div>
          <div className="hidden items-center text-base text-gray-900 dark:text-white xs:inline-flex">
            {format(new Date(member.createdAt), "dd/MM/yyyy HH:mm")}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ServerPageMember;
