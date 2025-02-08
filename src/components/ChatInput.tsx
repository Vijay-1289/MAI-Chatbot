
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FileUpload } from "./FileUpload";

interface ChatInputProps {
  onSend: (message: string) => void;
  onFileContent: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, onFileContent, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "inherit";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 border-t bg-white/80 backdrop-blur-sm p-4">
        <Button
          onClick={() => setShowUpload(!showUpload)}
          className="h-10 w-10 rounded-full bg-purple-500 p-2 hover:bg-purple-600 relative group"
          type="button"
        >
          <Upload className="h-4 w-4 text-white" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            📄 Upload file
          </span>
        </Button>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... ✨"
          className="min-h-[60px] w-full resize-none rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          disabled={disabled}
          rows={1}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="h-10 w-10 rounded-full bg-purple-500 p-2 hover:bg-purple-600 relative group"
        >
          <SendHorizontal className="h-4 w-4 text-white" />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            🚀 Send
          </span>
        </Button>
      </div>
      {showUpload && (
        <div className="absolute bottom-full w-full mb-2">
          <FileUpload onContentExtracted={onFileContent} />
        </div>
      )}
    </div>
  );
};
