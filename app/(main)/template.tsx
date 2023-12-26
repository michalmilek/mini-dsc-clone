import React from "react";

import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const Template = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavigationSidebar />
      <main>{children}</main>
    </>
  );
};

export default Template;
