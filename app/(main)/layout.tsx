import { SignedIn } from "@clerk/nextjs";
import React from "react";

import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      <NavigationSidebar />
      <main>{children}</main>
    </SignedIn>
  );
};

export default Layout;
