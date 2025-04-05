import { type Review } from "@shared/schema";

/**
 * LocalAI service that provides AI-like functionality without relying on external APIs
 * This is used as a fallback when OpenAI API is unavailable or rate-limited
 */
export class LocalAIService {
  /**
   * Generate sample reviews for testing purposes
   * This is not meant for production use
   */
  generateSampleReviews(driverId: number) {
    // These are purely for demo and testing purposes
    const sampleReviews = [
      {
        id: 1001,
        userId: 1,
        driverId,
        carId: 1,
        bookingId: 1001,
        rating: 5,
        comment: "Excellent driver! Very professional and knowledgeable about the city.",
        city: "New York",
        state: "NY"
      },
      {
        id: 1002,
        userId: 2,
        driverId,
        carId: 2,
        bookingId: 1002,
        rating: 4,
        comment: "Good experience overall. Driver was on time and knew all the shortcuts.",
        city: "Los Angeles",
        state: "CA"
      },
      {
        id: 1003,
        userId: 3,
        driverId,
        carId: 3,
        bookingId: 1003,
        rating: 5,
        comment: "Amazing service! Made our trip special with his local recommendations.",
        city: "Miami",
        state: "FL"
      }
    ];
    
    return sampleReviews;
  }
  
  /**
   * Analyze a review to extract sentiment and key feedback points
   */
  analyzeReview(review: Review): {
    sentiment: number; // 0-100 score
    strengths: string[];
    weaknesses: string[];
    keyPoints: string[];
    improvementAreas: string[];
  } {
    // Calculate sentiment based on rating (1-5 stars)
    const sentiment = review.rating * 20; // Simple conversion to 0-100 scale
    
    // Default responses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const keyPoints: string[] = [];
    const improvementAreas: string[] = [];
    
    // Extract keywords from comment
    const comment = review.comment || "";
    const lowerComment = comment.toLowerCase();
    
    // Process comment for positive aspects
    if (lowerComment.includes("professional") || lowerComment.includes("excellent")) {
      strengths.push("Professional and courteous service");
    }
    
    if (lowerComment.includes("knowledge") || lowerComment.includes("experience")) {
      strengths.push("Knowledgeable and experienced driver");
    }
    
    if (lowerComment.includes("time") || lowerComment.includes("punctual")) {
      strengths.push("Punctual and reliable");
    }
    
    if (lowerComment.includes("clean") || lowerComment.includes("nice")) {
      strengths.push("Clean and well-maintained vehicle");
    }
    
    // Process comment for negative aspects
    if (lowerComment.includes("late") || lowerComment.includes("delay")) {
      weaknesses.push("Issues with punctuality");
      improvementAreas.push("Improve timeliness and planning");
    }
    
    if (lowerComment.includes("rude") || lowerComment.includes("attitude")) {
      weaknesses.push("Communication challenges");
      improvementAreas.push("Enhance customer communication skills");
    }
    
    if (lowerComment.includes("expensive") || lowerComment.includes("price")) {
      weaknesses.push("Pricing concerns");
    }
    
    // Extract key points
    if (review.rating >= 4) {
      keyPoints.push("Overall positive experience");
    } else if (review.rating <= 2) {
      keyPoints.push("Experience failed to meet expectations");
    } else {
      keyPoints.push("Mixed experience with room for improvement");
    }
    
    // Ensure we have at least one item in each array
    if (strengths.length === 0) {
      if (review.rating >= 4) {
        strengths.push("High rating suggests good service quality");
      } else {
        strengths.push("Some positive aspects noted by the customer");
      }
    }
    
    if (weaknesses.length === 0 && review.rating < 5) {
      weaknesses.push("Minor areas for improvement exist");
    }
    
    if (improvementAreas.length === 0 && review.rating < 5) {
      improvementAreas.push("Continue to enhance the overall customer experience");
    }
    
    if (keyPoints.length === 1) {
      keyPoints.push(`Customer gave a ${review.rating}/5 star rating`);
    }
    
    // Return only top items for each category
    return {
      sentiment,
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      keyPoints: keyPoints.slice(0, 3),
      improvementAreas: improvementAreas.slice(0, 2)
    };
  }

  /**
   * Calculate driver insights based on multiple reviews
   */
  calculateDriverInsights(driverId: number, reviews: Review[]): {
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
  } {
    // Default values if no reviews
    if (reviews.length === 0) {
      return {
        overallScore: 75, // Default middle-high score
        scoreBreakdown: {
          professionalismScore: 75,
          safetyScore: 80,
          communicationScore: 70,
          knowledgeScore: 75,
          punctualityScore: 75
        },
        topStrengths: [
          "Professional driving experience",
          "Reliable service record",
          "Knowledge of local routes and destinations"
        ],
        improvementSuggestions: [
          "Continue to develop customer service skills",
          "Maintain vehicle cleanliness and condition"
        ],
        performanceSummary: "Limited review data available. Driver appears to maintain a professional standard of service."
      };
    }
    
    // Calculate overall score from reviews
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const overallScore = Math.round(avgRating * 20); // Convert 0-5 to 0-100
    
    // Initialize counters for specific aspects
    let professionalismMentions = 0;
    let safetyMentions = 0;
    let communicationMentions = 0;
    let knowledgeMentions = 0;
    let punctualityMentions = 0;
    
    // Process all review comments for keyword mentions
    reviews.forEach(review => {
      const comment = (review.comment || "").toLowerCase();
      
      if (comment.includes("professional") || comment.includes("courteous")) {
        professionalismMentions++;
      }
      
      if (comment.includes("safe") || comment.includes("careful") || comment.includes("secure")) {
        safetyMentions++;
      }
      
      if (comment.includes("communicat") || comment.includes("friendly") || comment.includes("talk")) {
        communicationMentions++;
      }
      
      if (comment.includes("knowledge") || comment.includes("expert") || comment.includes("inform")) {
        knowledgeMentions++;
      }
      
      if (comment.includes("time") || comment.includes("punctual") || comment.includes("wait")) {
        punctualityMentions++;
      }
    });
    
    // Calculate score breakdown based on mentions and overall score
    const baseScore = overallScore;
    const professionalismScore = Math.min(100, baseScore + (professionalismMentions * 5));
    const safetyScore = Math.min(100, baseScore + (safetyMentions * 5));
    const communicationScore = Math.min(100, baseScore + (communicationMentions * 5));
    const knowledgeScore = Math.min(100, baseScore + (knowledgeMentions * 5));
    const punctualityScore = Math.min(100, baseScore + (punctualityMentions * 5));
    
    // Determine top strengths
    const strengthsMap = [
      { score: professionalismScore, text: "Professional and courteous service" },
      { score: safetyScore, text: "Safe and secure driving practices" },
      { score: communicationScore, text: "Excellent communication with clients" },
      { score: knowledgeScore, text: "Extensive knowledge of routes and destinations" },
      { score: punctualityScore, text: "Punctual and reliable service" }
    ];
    
    const topStrengths = strengthsMap
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.text);
    
    // Determine improvement areas
    const weaknessesMap = [
      { score: professionalismScore, text: "Enhance professionalism and customer service approach" },
      { score: safetyScore, text: "Focus on safety and defensive driving techniques" },
      { score: communicationScore, text: "Improve communication and engagement with clients" },
      { score: knowledgeScore, text: "Expand knowledge of routes and local attractions" },
      { score: punctualityScore, text: "Enhance punctuality and time management" }
    ];
    
    const improvementSuggestions = weaknessesMap
      .sort((a, b) => a.score - b.score)
      .slice(0, 2)
      .map(s => s.text);
    
    // Generate performance summary
    let performanceSummary = "";
    if (overallScore >= 85) {
      performanceSummary = "Outstanding driver with consistently excellent reviews. Delivers premium service that meets or exceeds client expectations.";
    } else if (overallScore >= 70) {
      performanceSummary = "Solid performer with good customer feedback. Reliable driver who provides quality service with minor areas for improvement.";
    } else if (overallScore >= 50) {
      performanceSummary = "Average performance with mixed reviews. Shows potential but needs to address several areas to enhance service quality.";
    } else {
      performanceSummary = "Below average performance that requires attention. Multiple areas need improvement to meet the standard expected by clients.";
    }
    
    return {
      overallScore,
      scoreBreakdown: {
        professionalismScore,
        safetyScore,
        communicationScore,
        knowledgeScore,
        punctualityScore
      },
      topStrengths,
      improvementSuggestions,
      performanceSummary
    };
  }

  /**
   * Generate personalized driver recommendations for a user
   */
  getPersonalizedDriverRecommendations(
    userId: number, 
    userPreferences: string,
    driverProfiles: Array<{id: number, name: string, experience: number, specialties: string[], languages: string[], rating: number}>
  ): Array<{driverId: number, matchScore: number, reasonForMatch: string}> {
    const preferencesLower = (userPreferences || "").toLowerCase();
    
    // Score each driver
    const scoredDrivers = driverProfiles.map(driver => {
      let score = driver.rating / 5; // Base score from rating (0-100)
      let reasons: string[] = [];
      
      // Add points for experience
      score += Math.min(20, driver.experience * 2);
      
      // Check for specialty matches
      driver.specialties.forEach(specialty => {
        const specialtyLower = specialty.toLowerCase();
        if (preferencesLower.includes(specialtyLower)) {
          score += 15;
          reasons.push(`Specializes in ${specialty}`);
        }
      });
      
      // Check for language matches
      driver.languages.forEach(language => {
        const languageLower = language.toLowerCase();
        if (preferencesLower.includes(languageLower)) {
          score += 10;
          reasons.push(`Speaks ${language}`);
        }
      });
      
      // Add experience-based reason if no matches found
      if (reasons.length === 0) {
        reasons.push(`${driver.experience} years of professional experience`);
      }
      
      // Cap score at 100
      score = Math.min(100, score);
      
      return {
        driverId: driver.id,
        matchScore: Math.round(score),
        reasonForMatch: reasons[0]
      };
    });
    
    // Sort by score and return top 3
    return scoredDrivers.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }

  /**
   * Generate an AI-driven response to a user query about drivers or cars
   */
  getAIAssistantResponse(
    query: string,
    context: {
      availableCars?: Array<{id: number, name: string, brand: string, type: string, price: number}>,
      availableDrivers?: Array<{id: number, name: string, experience: number, specialties: string[]}>
    }
  ): {
    response: string,
    suggestedActions: string[]
  } {
    const queryLower = (query || "").toLowerCase();
    let response = "";
    let suggestedActions: string[] = [];
    
    // Handle car-related queries
    if (
      queryLower.includes("car") || 
      queryLower.includes("vehicle") || 
      queryLower.includes("rent") || 
      queryLower.includes("luxury")
    ) {
      if (context.availableCars && context.availableCars.length > 0) {
        const carCount = context.availableCars.length;
        const luxuryBrands = Array.from(new Set(context.availableCars.map(c => c.brand))).slice(0, 3);
        
        response = `We offer ${carCount} premium vehicles from top brands including ${luxuryBrands.join(", ")}. Our fleet includes sedans, SUVs, and sports cars to meet your specific needs.`;
        
        suggestedActions = [
          "Browse all available cars",
          "Filter cars by type or price range"
        ];
      } else {
        response = "We offer a premium selection of luxury vehicles from top brands. Our fleet includes sedans, SUVs, and sports cars to meet your specific needs.";
        
        suggestedActions = [
          "Browse all available cars",
          "Contact us for special requests"
        ];
      }
    } 
    // Handle driver-related queries
    else if (
      queryLower.includes("driver") || 
      queryLower.includes("chauffeur") || 
      queryLower.includes("professional")
    ) {
      if (context.availableDrivers && context.availableDrivers.length > 0) {
        const driverCount = context.availableDrivers.length;
        const maxExp = Math.max(...context.availableDrivers.map(d => d.experience));
        
        response = `We have ${driverCount} professional drivers available, with up to ${maxExp} years of experience. All our drivers are trained in luxury transportation and dedicated to providing exceptional service.`;
        
        suggestedActions = [
          "View all available drivers",
          "Request a driver by specialty"
        ];
      } else {
        response = "Our professional drivers are highly experienced and trained in luxury transportation. They are dedicated to providing exceptional service and ensuring your comfort throughout your journey.";
        
        suggestedActions = [
          "View all available drivers",
          "Learn about our driver standards"
        ];
      }
    }
    // Handle booking-related queries
    else if (
      queryLower.includes("book") || 
      queryLower.includes("reservation") || 
      queryLower.includes("reserve")
    ) {
      response = "Booking with Zoro Cars is easy and convenient. You can select your desired vehicle, dates, and optional driver services through our online booking system.";
      
      suggestedActions = [
        "Start a new booking",
        "Check availability calendar"
      ];
    }
    // Handle pricing-related queries
    else if (
      queryLower.includes("price") || 
      queryLower.includes("cost") || 
      queryLower.includes("rate")
    ) {
      response = "Our pricing varies based on the vehicle model, rental duration, and additional services. We offer competitive rates with discounts for longer rentals and return customers.";
      
      suggestedActions = [
        "View detailed pricing",
        "Get a custom quote"
      ];
    }
    // Default response
    else {
      response = "Welcome to Zoro Cars, your premier luxury car rental service. We offer a wide range of high-end vehicles and professional drivers to provide an exceptional experience.";
      
      suggestedActions = [
        "Explore our car collection",
        "Learn about our services"
      ];
    }
    
    return { response, suggestedActions };
  }
}

// Export a singleton instance
export const localAIService = new LocalAIService();