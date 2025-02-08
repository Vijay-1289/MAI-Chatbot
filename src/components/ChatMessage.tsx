
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

const formatMessage = (content: string) => {
  return content.split(/(\*\*\*.*?\*\*\*)/).map((part, index) => {
    if (part.startsWith('***') && part.endsWith('***')) {
      return <strong key={index}>{part.slice(3, -3)}</strong>;
    }
    return part;
  });
};

export const ChatMessage = ({ message, isLast }: ChatMessageProps) => {
  const isAI = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isAI ? "bg-purple-50/50 backdrop-blur-sm" : "bg-white/50"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isAI ? "bg-purple-500 text-white" : "bg-gray-100"
        )}
      >
        {isAI ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          {isAI ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              MAI
            </motion.span>
          ) : (
            "You"
          )}
        </p>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600">
            {isAI && isLast ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {formatMessage(message.content)}
              </motion.span>
            ) : (
              formatMessage(message.content)
            )}
          </p>
        </div>
      </div>
      {isAI && isLast && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="absolute -top-2 -right-2 animate-pulse"
        >
          <span className="inline-flex h-4 w-4 rounded-full bg-purple-500" />
        </motion.div>
      )}
    </motion.div>
  );
};
