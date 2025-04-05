import OpenAI from "openai";
import { type Review } from "@shared/schema";
import { localAIService } from "./local-ai";

// Initialize OpenAI client
// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Force local AI implementation to be used regardless of OpenAI API Key
// This is for demo purposes to show the local AI implementation
function shouldUseLocalAI(): boolean {
  // Always return true to force local AI implementation
  return true;
}

// Log this change once at startup
console.log("AI Service - FORCED to use local AI implementation for demonstration purposes");

/**
 * AI service to analyze reviews and provide driver insights
 */
export class AIService {
  /**
   * Analyze a review to extract sentiment and key feedback points
   */
  async analyzeReview(review: Review): Promise<{
    sentiment: number; // 0-100 score
    strengths: string[];
    weaknesses: string[];
    keyPoints: string[];
    improvementAreas: string[];
  }> {
    // If we're using local AI, skip OpenAI call entirely
    if (shouldUseLocalAI()) {
      return localAIService.analyzeReview(review);
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that analyzes driver reviews for a luxury car rental service. Extract sentiment and key feedback points."
          },
          {
            role: "user",
            content: `Please analyze this driver review and provide the following:
              1. Sentiment score (0-100, where 100 is extremely positive)
              2. Driver strengths (list up to 3)
              3. Driver weaknesses (list up to 3, if any)
              4. Key feedback points (list up to 3)
              5. Areas for improvement (list up to 2, if any)
              
              Review: Rating: ${review.rating}/5
              Comment: ${review.comment || "No comment provided"}
              
              Respond with JSON in this format: 
              {
                "sentiment": number,
                "strengths": [string],
                "weaknesses": [string],
                "keyPoints": [string],
                "improvementAreas": [string]
              }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Error analyzing review:", error);
      // Use local AI implementation as fallback
      return localAIService.analyzeReview(review);
    }
  }

  /**
   * Calculate driver insights based on multiple reviews
   */
  async calculateDriverInsights(driverId: number, reviews: Review[]): Promise<{
    overallScore: number;
    scoreBreakdown: {
      professionalismScore: number;
      safetyScore: number;
      communicationScore: number;
      knowledgeScore: number;
      punctualityScore: number;
    };
    topStrengths: string[];
    improvementSuggestions: string[];
    performanceSummary: string;
  }> {
    // If we're using local AI, skip OpenAI call entirely
    if (shouldUseLocalAI()) {
      return localAIService.calculateDriverInsights(driverId, reviews);
    }
    
    try {
      // Combine all reviews for this driver
      const reviewsText = reviews.map(r => 
        `- Rating: ${r.rating}/5, Comment: ${r.comment || "No comment provided"}`
      ).join("\n");

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that analyzes driver performance based on customer reviews for a luxury car rental service."
          },
          {
            role: "user",
            content: `Please analyze these driver reviews (ID: ${driverId}) and provide comprehensive driver insights:

              Reviews:
              ${reviewsText}
              
              Calculate and provide:
              1. Overall AI-adjusted score (0-100)
              2. Score breakdown for: professionalism, safety, communication, knowledge, punctuality (0-100 each)
              3. Top strengths (up to 3)
              4. Improvement suggestions (up to 3)
              5. Brief performance summary (1-2 sentences)
              
              Respond with JSON in this format:
              {
                "overallScore": number,
                "scoreBreakdown": {
                  "professionalismScore": number,
                  "safetyScore": number,
                  "communicationScore": number,
                  "knowledgeScore": number,
                  "punctualityScore": number
                },
                "topStrengths": [string],
                "improvementSuggestions": [string],
                "performanceSummary": string
              }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error("Error calculating driver insights:", error);
      // Use local AI implementation as fallback
      return localAIService.calculateDriverInsights(driverId, reviews);
    }
  }

  /**
   * Generate personalized driver recommendations for a user
   */
  async getPersonalizedDriverRecommendations(
    userId: number, 
    userPreferences: string,
    driverProfiles: Array<{id: number, name: string, experience: number, specialties: string[], languages: string[], rating: number}>
  ): Promise<Array<{driverId: number, matchScore: number, reasonForMatch: string}>> {
    // If we're using local AI, skip OpenAI call entirely
    if (shouldUseLocalAI()) {
      return localAIService.getPersonalizedDriverRecommendations(userId, userPreferences, driverProfiles);
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are an AI assistant that recommends drivers for a luxury car rental service based on user preferences."
          },
          {
            role: "user",
            content: `Recommend the best drivers for a user with the following preferences:
              
              User ID: ${userId}
              User Preferences: ${userPreferences || "No specific preferences provided"}
              
              Available Drivers:
              ${driverProfiles.map(d => 
                `- ID: ${d.id}, Name: ${d.name}, Experience: ${d.experience} years, Specialties: ${d.specialties.join(', ')}, Languages: ${d.languages.join(', ')}, Rating: ${d.rating / 100}/5`
              ).join('\n')}
              
              For each recommendation, provide:
              1. Driver ID
              2. Match score (0-100)
              3. Reason for recommending (1 sentence)
              
              Recommend up to 3 drivers sorted by match score.
              
              Respond with JSON in this format:
              [
                {
                  "driverId": number,
                  "matchScore": number,
                  "reasonForMatch": string
                }
              ]`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content || "[]";
      return JSON.parse(content);
    } catch (error) {
      console.error("Error generating driver recommendations:", error);
      // Use local AI implementation as fallback
      return localAIService.getPersonalizedDriverRecommendations(userId, userPreferences, driverProfiles);
    }
  }

  /**
   * Generate an AI-driven response to a user query about drivers or cars
   */
  async getAIAssistantResponse(
    query: string,
    context: {
      availableCars?: Array<{id: number, name: string, brand: string, type: string, price: number}>,
      availableDrivers?: Array<{id: number, name: string, experience: number, specialties: string[]}>
    }
  ): Promise<{
    response: string,
    suggestedActions: string[],
    aiGenerated?: boolean
  }> {
    // If we're using local AI, skip OpenAI call entirely
    if (shouldUseLocalAI()) {
      const result = localAIService.getAIAssistantResponse(query, context);
      return { ...result, aiGenerated: true };
    }
    
    try {
      let contextStr = "";
      
      if (context.availableCars) {
        contextStr += "Available Cars:\n";
        contextStr += context.availableCars.map(c => 
          `- ID: ${c.id}, ${c.brand} ${c.name}, Type: ${c.type}, Price: $${c.price}/day`
        ).join('\n') + '\n\n';
      }
      
      if (context.availableDrivers) {
        contextStr += "Available Drivers:\n";
        contextStr += context.availableDrivers.map(d => 
          `- ID: ${d.id}, ${d.name}, Experience: ${d.experience} years, Specialties: ${d.specialties.join(', ')}`
        ).join('\n');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant for Zoro Cars, a luxury car rental service. Provide helpful, concise responses to user queries about cars, drivers, and rental options."
          },
          {
            role: "user",
            content: `Respond to this user query about our car rental service:
              
              User Query: "${query || "How can I help you with our car rental service?"}"
              
              Context Information:
              ${contextStr}
              
              Provide:
              1. A helpful response (2-3 sentences maximum)
              2. Up to 2 suggested actions the user could take
              
              Respond with JSON in this format:
              {
                "response": string,
                "suggestedActions": [string]
              }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content || "{}";
      return { ...JSON.parse(content), aiGenerated: true };
    } catch (error) {
      console.error("Error generating AI assistant response:", error);
      // Use local AI implementation as fallback
      const result = localAIService.getAIAssistantResponse(query, context);
      return { ...result, aiGenerated: true };
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();
