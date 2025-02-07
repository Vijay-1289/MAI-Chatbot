import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const isAI = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isAI ? "bg-mai-light" : "bg-white"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isAI ? "bg-mai text-white" : "bg-gray-100"
        )}
      >
        {isAI ? "M" : "U"}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          {isAI ? "MAI" : "You"}
        </p>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600">{message.content}</p>
        </div>
      </div>
    </motion.div>
  );
};