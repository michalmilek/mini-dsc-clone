"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NotFoundCountdown = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
        <p className="text-gray-500 mb-4">
          You do not have access to this page.
        </p>
        <p className="text-gray-500">Redirecting in {countdown} seconds...</p>
      </div>
    </div>
  );
};

export default NotFoundCountdown;
