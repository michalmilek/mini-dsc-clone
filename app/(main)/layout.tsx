import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { SignedIn } from "@clerk/nextjs";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      <NavigationSidebar />
      <main>{children}</main>
    </SignedIn>
  );
};

export default Layout;
