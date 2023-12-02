import React from "react";

import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavigationSidebar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
