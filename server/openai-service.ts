import OpenAI from "openai";
import { log } from "./vite";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Common interfaces
export interface SkillAnalysis {
  driving_skill: number;
  communication: number;
  punctuality: number;
  professionalism: number;
  vehicle_condition: number;
}

export interface NLPResult {
  driver_id: number;
  driver_name: string;
  sentiment_score: number;
  skill_analysis: SkillAnalysis;
  insights: string[];
  recommendations: string[];
}

/**
 * Analyze review text using OpenAI API
 * @param reviewText - Text of the review to analyze
 * @param driver - Driver object with id, name, experience fields
 * @returns NLP analysis result
 */
export async function analyzeReviewWithOpenAI(reviewText: string, driver: any): Promise<NLPResult> {
  try {
    // Create OpenAI prompt for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes customer reviews of drivers for a car rental service. 
          Analyze the following review of a driver and provide:

          1. An overall sentiment score from 1-5 (where 5 is extremely positive, 3 is neutral, and 1 is very negative)
          2. A specific rating from 1-5 for each of these skills:
             - driving_skill
             - communication
             - punctuality
             - professionalism
             - vehicle_condition
          3. 1-3 insights drawn from the review
          4. 1-2 recommendations for improvement
            
          Important: Your analysis should properly take into account extremely positive sentiments. If a review is genuinely extremely positive, do give a 5-star rating. If a review is mildly positive, give around 4 stars.
          
          Here's the driver information:
          - Name: ${driver.name}
          - Experience: ${driver.experience} years
          - ID: ${driver.id}

          Respond in JSON format with these fields:
          {
            "driver_id": number,
            "driver_name": string,
            "sentiment_score": number,
            "skill_analysis": {
              "driving_skill": number,
              "communication": number,
              "punctuality": number,
              "professionalism": number,
              "vehicle_condition": number
            },
            "insights": string[],
            "recommendations": string[]
          }
          
          Do not include explanations. Only return valid JSON.`
        },
        {
          role: "user",
          content: reviewText
        }
      ],
      response_format: { type: "json_object" }
    });

    // Extract the content from the API response
    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    
    // Log the analysis
    log(`OpenAI analyzed review for driver ${driver.name}: ${JSON.stringify(result)}`, "ai");
    
    return result;
  } catch (error) {
    console.error("Error analyzing review with OpenAI:", error);
    // Fall back to simulation if API fails
    return simulateNLPAnalysis(reviewText, driver);
  }
}

/**
 * Generate an AI review for a driver using OpenAI
 * @param driver - Driver object with id, name, experience fields
 * @returns Generated review text
 */
export async function generateReviewWithOpenAI(driver: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that generates authentic-sounding customer reviews for drivers. 
          Generate a brief, realistic review (2-3 sentences) for a driver that sounds like it could have been written by a real customer.
          
          Driver info:
          - Name: ${driver.name}
          - Experience: ${driver.experience} years
          
          Make the review mostly positive but realistic with specific details about the driver's performance. 
          Keep it conversational and brief (max 40 words).`
        },
        {
          role: "user",
          content: `Generate a customer review for driver ${driver.name} with ${driver.experience} years of experience.`
        }
      ]
    });

    const reviewText = response.choices[0].message.content || '';
    log(`OpenAI generated review for driver ${driver.name}: ${reviewText}`, "ai");
    
    return reviewText;
  } catch (error) {
    console.error("Error generating review with OpenAI:", error);
    // Fall back to simulation if API fails
    return generateSimulatedReview(driver);
  }
}

// Fallback functions for simulation (copied from routes.ts)

function simulateNLPAnalysis(text: string, driver: any): NLPResult {
  const positiveWords = [
    "excellent", "amazing", "outstanding", "brilliant", "exceptional",
    "great", "good", "awesome", "fantastic", "wonderful", "professional",
    "helpful", "friendly", "polite", "courteous", "reliable", "punctual",
    "timely", "safe", "clean", "comfortable", "responsive", "attentive",
    "skilled", "expert", "knowledgeable", "experienced", "efficient",
    "perfect", "superb", "best", "incredible", "impressive", "top", "superior"
  ];
  
  const negativeWords = [
    "poor", "bad", "terrible", "awful", "horrible", "disappointing",
    "rude", "unprofessional", "unreliable", "late", "dirty", "unsafe",
    "uncomfortable", "slow", "unresponsive", "careless", "inexperienced",
    "inefficient", "dangerous", "aggressive", "unprepared", "confused"
  ];
  
  const veryPositiveWords = [
    "perfect", "exceptional", "outstanding", "superb", "excellent", 
    "brilliant", "amazing", "incredible", "flawless", "best"
  ];
  
  const skillWords: Record<keyof SkillAnalysis, string[]> = {
    driving_skill: ["drive", "driving", "skill", "control", "maneuver", "handling", "navigate"],
    communication: ["communicate", "communication", "response", "responsive", "talk", "explain", "update"],
    punctuality: ["punctual", "time", "early", "late", "delay", "wait", "schedule", "arrival"],
    professionalism: ["professional", "manner", "conduct", "behavior", "attitude", "respectful", "courteous"],
    vehicle_condition: ["car", "vehicle", "clean", "maintained", "condition", "interior", "exterior"]
  };
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Calculate sentiment
  let positiveCount = 0;
  let negativeCount = 0;
  let veryPositiveCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  veryPositiveWords.forEach(word => {
    if (lowerText.includes(word)) veryPositiveCount++;
  });
  
  // Calculate sentiment score (1-5 scale)
  const sentimentDiff = positiveCount - negativeCount;
  let sentimentScore = 3; // Neutral baseline
  
  if (sentimentDiff > 0) {
    // Improved scaling to allow reaching 5 stars more easily
    sentimentScore = Math.min(5, 3 + sentimentDiff * 0.5);
    
    // Boost score for very positive words
    if (veryPositiveCount > 0) {
      sentimentScore = Math.min(5, sentimentScore + veryPositiveCount * 0.5);
    }
  } else if (sentimentDiff < 0) {
    sentimentScore = Math.max(1, 3 + sentimentDiff * 0.5);
  }
  
  // Analyze skills
  const skillScores: SkillAnalysis = {
    driving_skill: 3,
    communication: 3,
    punctuality: 3,
    professionalism: 3,
    vehicle_condition: 3
  };
  
  // Adjust skill scores based on text analysis
  Object.entries(skillWords).forEach(([skill, keywords]) => {
    let skillMentions = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) skillMentions++;
    });
    
    if (skillMentions > 0) {
      // Adjust the score based on sentiment and mentions
      const skillKey = skill as keyof SkillAnalysis;
      if (sentimentScore > 3) {
        skillScores[skillKey] = Math.min(5, 3 + skillMentions * 0.5);
      } else if (sentimentScore < 3) {
        skillScores[skillKey] = Math.max(1, 3 - skillMentions * 0.5);
      }
    }
  });
  
  // Generate insights
  const insights: string[] = [];
  
  // Experience-based insights
  if (driver.experience > 5) {
    insights.push(`${driver.name}'s ${driver.experience} years of experience clearly shows in their driving skills.`);
  }
  
  // Sentiment-based insights
  if (sentimentScore > 4) {
    insights.push("Passengers consistently rate this driver very highly.");
  } else if (sentimentScore < 2) {
    insights.push("There may be some areas where this driver could improve.");
  }
  
  // Skill-based insights
  const topSkill = Object.entries(skillScores).reduce(
    (best, [skill, score]) => score > best[1] ? [skill, score] : best,
    ["", 0]
  );
  
  if (topSkill[1] > 3) {
    const skillName = (topSkill[0] as string).replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
    insights.push(`${skillName} is this driver's strongest attribute based on passenger reviews.`);
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  const lowestSkill = Object.entries(skillScores).reduce(
    (worst, [skill, score]) => score < worst[1] ? [skill, score] : worst,
    ["", 5]
  );
  
  if (lowestSkill[1] < 4) {
    const skillName = (lowestSkill[0] as string).replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
    recommendations.push(`Consider focusing on improving ${skillName} for better passenger satisfaction.`);
  }
  
  // If the driver is highly rated, still provide some meaningful recommendation
  if (sentimentScore > 4 && recommendations.length === 0) {
    recommendations.push("Continue maintaining your excellent service standards.");
  }
  
  return {
    driver_id: driver.id,
    driver_name: driver.name,
    sentiment_score: Number(sentimentScore.toFixed(1)),
    skill_analysis: {
      driving_skill: Number(skillScores.driving_skill.toFixed(1)),
      communication: Number(skillScores.communication.toFixed(1)),
      punctuality: Number(skillScores.punctuality.toFixed(1)),
      professionalism: Number(skillScores.professionalism.toFixed(1)),
      vehicle_condition: Number(skillScores.vehicle_condition.toFixed(1))
    },
    insights,
    recommendations
  };
}

function generateSimulatedReview(driver: any): string {
  const experiencePhrases = [
    `The driver has ${driver.experience} years of experience which shows in their driving style.`,
    `With ${driver.experience} years on the road, ${driver.name} handles the vehicle confidently.`,
    `${driver.name}'s ${driver.experience} years of experience translates to a smooth ride.`
  ];
  
  const skillPhrases = [
    "Their communication was clear and timely.",
    "The vehicle was well-maintained and clean.",
    "Punctuality was excellent, arriving right on schedule.",
    "Very professional attitude and appearance.",
    "The driving was smooth and comfortable throughout the journey."
  ];
  
  // Select one experience phrase and one skill phrase randomly
  const experiencePhrase = experiencePhrases[Math.floor(Math.random() * experiencePhrases.length)];
  const skillPhrase = skillPhrases[Math.floor(Math.random() * skillPhrases.length)];
  
  // Sometimes add a second skill phrase
  const secondSkillPhrase = Math.random() > 0.5 
    ? " " + skillPhrases[Math.floor(Math.random() * skillPhrases.length)] 
    : "";
  
  return experiencePhrase + " " + skillPhrase + secondSkillPhrase;
}