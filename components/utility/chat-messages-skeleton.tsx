import ChatMessageSkeleton from "@/components/utility/chat-message-skeleton";

const ChatMessagesSkeleton = () => {
  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-full">
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
      <ChatMessageSkeleton />
      <ChatMessageSkeleton isSelf={false} />
    </div>
  );
};

export default ChatMessagesSkeleton;
