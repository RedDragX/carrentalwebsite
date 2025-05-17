import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// Initialize API clients - check if keys are available
const openaiApiKey = process.env.OPENAI_API_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY || '';

// Only initialize clients when keys are present
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
const gemini = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

// Log which providers are available
console.log(`AI Providers available: ${[
  openaiApiKey ? 'OpenAI' : null,
  geminiApiKey ? 'Gemini' : null,
  huggingfaceApiKey ? 'HuggingFace' : null
].filter(Boolean).join(', ')}`);

// Check if any provider is available
if (!openaiApiKey && !geminiApiKey && !huggingfaceApiKey) {
  console.warn('Warning: No AI provider API keys found. Chatbot will use fallback responses only.');
}

// Types for the chat messages
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// The core system prompt that defines Zoro's personality and knowledge
const SYSTEM_PROMPT = `You are Zoro, a helpful AI assistant for the Zoro Cars luxury car rental service. 
        
Your primary role is to provide information about car bookings, the luxury car fleet, driver services, and connect users with customer support when needed.

Information about Zoro Cars:
- Luxury car rental service with high-end vehicles (Lamborghini, Ferrari, Porsche, Rolls Royce, Bentley, Aston Martin)
- Offers both self-drive and chauffeur services
- Pricing is premium, typically ranging from $599 to $1200 per day depending on vehicle
- Booking requires a valid driver's license, insurance, and a security deposit
- Cancellation policy: Full refund if canceled 72+ hours before rental, 50% refund if canceled 24-72 hours before, no refund if canceled less than 24 hours
- All cars come with comprehensive insurance and 24/7 roadside assistance
- Minimum rental period is 24 hours
- Available in major cities with airport pickup available

When responding:
- Be professional but friendly and conversational
- Keep responses concise and focused on the user's question
- If you don't know something specific, offer to connect them with customer service
- For booking inquiries, explain the general process but suggest they complete it on the website
- Highlight luxury features and exceptional service
        
Always aim to provide a premium customer service experience that matches the luxury brand image.`;

/**
 * Try to get a response from OpenAI
 */
async function getOpenAIResponse(messages: ChatMessage[]): Promise<string | null> {
  // Skip if OpenAI client is not initialized
  if (!openai || !openaiApiKey) {
    console.log('OpenAI API key not available, skipping');
    return null;
  }
  
  try {
    console.log('Attempting to get response from OpenAI...');
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai?.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI error:', error);
    return null;
  }
}

/**
 * Try to get a response from Google Gemini
 */
async function getGeminiResponse(messages: ChatMessage[]): Promise<string | null> {
  // Skip if Gemini client is not initialized
  if (!gemini || !geminiApiKey) {
    console.log('Gemini API key not available, skipping');
    return null;
  }
  
  try {
    console.log('Attempting to get response from Gemini...');
    // Convert messages to Gemini format (handling system message specially)
    let geminiPrompt = "";
    let userMessages: string[] = [];
    
    messages.forEach(msg => {
      if (msg.role === 'system') {
        geminiPrompt = msg.content + "\n\n";
      } else if (msg.role === 'user') {
        userMessages.push(msg.content);
      }
    });
    
    // Add the last few user messages to the prompt
    geminiPrompt += "User's recent messages:\n" + userMessages.join("\n");
    
    // Use Gemini Pro model (with null check)
    const model = gemini?.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    if (!model) return null;
    
    const result = await model.generateContent(geminiPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  }
}

/**
 * Try to get a response from Hugging Face (using Mistral API)
 */
async function getHuggingFaceResponse(messages: ChatMessage[]): Promise<string | null> {
  // Skip if Hugging Face API key is not available
  if (!huggingfaceApiKey) {
    console.log('Hugging Face API key not available, skipping');
    return null;
  }
  
  try {
    console.log('Attempting to get response from Hugging Face...');
    // Format messages for Hugging Face
    const formattedMessages = messages.map(msg => {
      if (msg.role === 'system') {
        return { role: 'system', content: msg.content };
      } else if (msg.role === 'user') {
        return { role: 'user', content: msg.content };
      } else {
        return { role: 'assistant', content: msg.content };
      }
    });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        headers: { 
          Authorization: `Bearer ${huggingfaceApiKey}`,
          "Content-Type": "application/json" 
        },
        method: "POST",
        body: JSON.stringify({
          inputs: {
            messages: formattedMessages
          }
        }),
      }
    );

    const result = await response.json();
    if (result && result.generated_text) {
      return result.generated_text;
    }
    return null;
  } catch (error) {
    console.error('Hugging Face error:', error);
    return null;
  }
}

/**
 * Get a fallback response when all AI providers fail
 */
function getFallbackResponse(message: string): string {
  // Generate a simple pattern-based response
  if (message.toLowerCase().includes('book')) {
    return "To book a car, you can use our website's booking platform. Simply select your desired car, dates, and whether you need a chauffeur. You'll need a valid driver's license and credit card for the security deposit. Would you like me to guide you through the specific steps?";
  } 
  else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost') || message.toLowerCase().includes('fee')) {
    return "Our luxury vehicles range from $599 to $1200 per day, depending on the model. This includes insurance and roadside assistance. Additional services like chauffeurs or airport delivery may have extra fees. May I help you with pricing for a specific car?";
  }
  else if (message.toLowerCase().includes('cancel')) {
    return "Our cancellation policy offers a full refund if you cancel 72+ hours before your rental, a 50% refund if canceled 24-72 hours before, and no refund for cancellations less than 24 hours before your reservation. Would you like help with a cancellation?";
  }
  else {
    return "I'd be happy to help you with information about our luxury car rentals, booking process, or answer any other questions about Zoro Cars. Could you please provide a bit more detail about what you'd like to know?";
  }
}

/**
 * Generate a response using multiple AI providers with fallbacks
 */
export async function generateMultiProviderResponse(message: string, history: ChatMessage[] = []): Promise<string> {
  // Create conversation history with system prompt
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    }
  ];

  // Add conversation history if provided
  if (history.length > 0) {
    messages.push(...history);
  }

  // Add the new user message
  messages.push({
    role: 'user',
    content: message
  });

  // Try OpenAI first
  const openAIResponse = await getOpenAIResponse(messages);
  if (openAIResponse) {
    console.log("Using OpenAI response");
    return openAIResponse;
  }

  // Try Gemini second
  const geminiResponse = await getGeminiResponse(messages);
  if (geminiResponse) {
    console.log("Using Gemini response");
    return geminiResponse;
  }

  // Try Hugging Face third
  const huggingFaceResponse = await getHuggingFaceResponse(messages);
  if (huggingFaceResponse) {
    console.log("Using Hugging Face response");
    return huggingFaceResponse;
  }

  // If all fail, use a fallback response
  console.log("Using fallback response");
  return getFallbackResponse(message);
}