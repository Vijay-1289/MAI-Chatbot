
import { useState } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const newMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, newMessage]);

      // Show thinking animation toast
      const toastId = toast({
        title: "🤔 Thinking...",
        description: "Processing your message ✨",
        className: "bg-purple-500 text-white",
        duration: 100000, // Long duration that we'll dismiss manually
      });

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { messages: [...messages, newMessage] },
      });

      // Dismiss the thinking toast using the id
      toast({
        id: toastId.id,
        duration: 0,
      });

      if (error) {
        // Check if it's a rate limit error (status 429)
        if (error.status === 429) {
          toast({
            title: "⏳ Taking a breather!",
            description: "We've hit our limit. Please try again in a few minutes! 🌟",
            variant: "destructive",
            duration: 5000,
          });
          return;
        }
        
        throw error;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      // Show success toast with celebration
      toast({
        title: "🎉 Response received!",
        description: "Check out the magic below ✨",
        className: "bg-purple-500 text-white",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "😔 Oops!",
        description: "Something magical went wrong. Let's try again! ✨",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col relative overflow-hidden">
      {/* Aurora lights background effect with enhanced animation */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-green-500/30 animate-aurora opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-aurora-reverse opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-bl from-green-500/20 via-blue-500/20 to-purple-500/20 animate-aurora-slow opacity-50" />
      </div>
      
      <header className="relative z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white"
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
          <h1 className="text-xl font-semibold">MAI Chat ✨</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 p-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center space-y-4 p-8"
              >
                <motion.p 
                  className="text-gray-500"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ Start a magical conversation with MAI! 🌟
                </motion.p>
              </motion.div>
            ) : (
              messages.map((message, i) => (
                <ChatMessage
                  key={i}
                  message={message}
                  isLast={i === messages.length - 1}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="relative z-10">
        <ChatInput 
          onSend={handleSendMessage}
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default Index;
