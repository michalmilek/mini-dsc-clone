import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginAlert = () => {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Test account</AlertTitle>
      <AlertDescription>
        Login: michalmilekk1@gmail.com
        <br />
        Password: Testdsc123
      </AlertDescription>
    </Alert>
  );
};

export default LoginAlert;
