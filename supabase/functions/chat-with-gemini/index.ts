
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    const { messages } = await req.json();
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: msg.content,
      })),
    });

    const lastMessage = messages[messages.length - 1];
    
    try {
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      return new Response(JSON.stringify({ response: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError);
      
      // Check if it's a rate limit error
      if (apiError.message?.includes('429') || apiError.message?.includes('quota')) {
        return new Response(
          JSON.stringify({ 
            error: "✨ We've hit our limit for now! Please try again in a few minutes. 🌟",
            isRateLimit: true 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw apiError; // Re-throw other API errors
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        friendly: "🤔 Oops! Something went wrong. Please try again in a moment! ✨"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
