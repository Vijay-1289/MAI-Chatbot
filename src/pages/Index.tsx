
import { useState } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { FileUpload } from "@/components/FileUpload";
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

      // Celebration animation
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
      {/* Enhanced gradient background with animation */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(to right, rgba(167, 139, 250, 0.1), rgba(139, 92, 246, 0.1))",
            "linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1))",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 z-0"
      />
      
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
                <FileUpload onContentExtracted={handleFileContent} />
              </motion.div>
            ) : (
              <>
                {messages.map((message, i) => (
                  <ChatMessage
                    key={i}
                    message={message}
                    isLast={i === messages.length - 1}
                  />
                ))}
                <FileUpload onContentExtracted={handleFileContent} />
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;
