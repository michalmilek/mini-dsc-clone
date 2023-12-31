import LoginAlert from "@/components/utility/login-alert";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <LoginAlert />
      <SignIn />;
    </>
  );
}
