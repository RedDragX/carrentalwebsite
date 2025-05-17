import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Types for the chat messages
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Generate a response from the chatbot using OpenAI
 * @param message Current user message
 * @param history Previous messages for context
 */
export async function generateChatbotResponse(message: string, history: ChatMessage[] = []): Promise<string> {
  try {
    // Create conversation history with system prompt
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are Zoro, a helpful AI assistant for the Zoro Cars luxury car rental service. 
        
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
        
Always aim to provide a premium customer service experience that matches the luxury brand image.`
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

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm not sure how to respond to that. Can you try asking in a different way?";
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    return "I'm having some technical difficulties right now. Please try again later or contact customer support for immediate assistance.";
  }
}