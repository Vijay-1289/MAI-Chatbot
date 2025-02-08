
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onContentExtracted: (content: string) => void;
}

export const FileUpload = ({ onContentExtracted }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const allowedTypes = ['text/plain', 'application/pdf'];
    const file = files[0];

    if (!file || !allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a text or PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('extract-text', {
        body: formData,
      });

      if (error) throw error;

      onContentExtracted(data.content);
      toast({
        title: "Success",
        description: "File content extracted successfully!",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      className={`relative mt-4 rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
        isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
      }`}
    >
      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <UploadCloud className={`h-8 w-8 ${isUploading ? 'animate-bounce' : ''} text-purple-500`} />
        <p className="text-sm text-gray-600">
          {isUploading ? 'Processing...' : 'Drop your file here or click to upload'}
        </p>
        <p className="text-xs text-gray-500">Supports TXT and PDF</p>
      </div>
    </div>
  );
};
