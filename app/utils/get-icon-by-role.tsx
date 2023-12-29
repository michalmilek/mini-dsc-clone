import { ShieldAlert, ShieldCheck, User } from "lucide-react";

import { MemberRole } from "@prisma/client";

export function getIconByRole(type: MemberRole) {
  switch (type) {
    case "ADMIN":
      return <ShieldAlert className="text-red-500" />;
    case "MODERATOR":
      return <ShieldCheck className="text-indigo-600" />;
    default:
      return <User />;
  }
}
