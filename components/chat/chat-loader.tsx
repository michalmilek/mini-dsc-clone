import { RefreshCcw } from "lucide-react";

const ChatLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-x-4  w-full">
      <RefreshCcw
        className="text-gray-600 animate-spin"
        size={24}
      />
      <p>Loading...</p>
    </div>
  );
};

export default ChatLoader;
