import { useState } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const newMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, newMessage]);

      // Here we'll add the API call to Gemini later
      const response = "This is a placeholder response. Please add your Gemini API key to enable AI responses.";
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mai-light via-mai to-mai-dark animate-gradient-x z-0" />
      
      <header className="relative z-10 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-mai text-white">
            M
          </div>
          <h1 className="text-xl font-semibold">MAI Chat</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl space-y-4 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Start a conversation with MAI!</p>
            </div>
          ) : (
            messages.map((message, i) => (
              <ChatMessage
                key={i}
                message={message}
                isLast={i === messages.length - 1}
              />
            ))
          )}
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;