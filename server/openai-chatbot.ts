import { generateMultiProviderResponse, type ChatMessage } from './ai-providers';

/**
 * Generate a response from the chatbot using multiple AI providers with fallbacks
 * @param message Current user message
 * @param history Previous messages for context
 */
export async function generateChatbotResponse(message: string, history: ChatMessage[] = []): Promise<string> {
  // Use our multi-provider implementation that tries different AI services
  return generateMultiProviderResponse(message, history);
}