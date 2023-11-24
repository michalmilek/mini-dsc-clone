import React from "react";
import { SignedIn } from "@clerk/nextjs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <SignedIn>{children}</SignedIn>;
};

export default Layout;
