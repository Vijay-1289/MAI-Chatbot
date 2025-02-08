
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

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { messages: [...messages, newMessage] },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      toast({
        title: "Response received! 🎉",
        description: "Check out the AI's response below",
        className: "bg-purple-500 text-white",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileContent = (content: string) => {
    handleSendMessage(`Please analyze this content: ${content}`);
  };

  return (
    <div className="flex h-screen flex-col relative overflow-hidden">
      {/* Aurora lights background effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-green-500/20 animate-aurora" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-aurora-reverse" />
        <div className="absolute inset-0 bg-gradient-to-bl from-green-500/10 via-blue-500/10 to-purple-500/10 animate-aurora-slow" />
      </div>
      
      <header className="relative z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white"
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
          <h1 className="text-xl font-semibold">MAI Chat</h1>
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
                <p className="text-gray-500">Start a conversation with MAI!</p>
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
          onFileContent={handleFileContent}
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default Index;
