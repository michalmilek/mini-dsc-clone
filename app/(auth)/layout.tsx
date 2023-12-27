import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <title>Mini DSC - Auth</title>
      <div className="wrapper">{children}</div>;
    </>
  );
};

export default AuthLayout;
