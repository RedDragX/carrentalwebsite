import { Request, Response } from "express";
import { aiService } from "../services/ai";
import { localAIService } from "../services/local-ai";
import { storage } from "../storage";

/**
 * Force using local AI implementation regardless of API key
 * This is for demonstration purposes
 */
function isUsingLocalAI(): boolean {
  // Always use local AI implementation
  return true;
}

/**
 * Register AI-related routes
 * @param app Express application
 */
export function registerAIRoutes(app: any) {
  /**
   * Check if we're using the local AI implementation
   */
  app.get("/api/ai/status", (_req: Request, res: Response) => {
    // Always return that we're using local AI implementation
    // This is for demonstration purposes
    console.log("API Status - FORCED to use local AI implementation for demonstration purposes");
    
    res.json({ 
      usingLocalAI: true,
      message: "Using local AI implementation for responses. Features may be limited."
    });
  });
  // Get AI-driven insights for a driver
  app.get("/api/ai/driver-insights/:driverId", async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.driverId);
      if (isNaN(driverId)) {
        return res.status(400).json({ error: "Invalid driver ID" });
      }

      // Get the driver
      const driver = await storage.getDriver(driverId);
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }

      // Get all reviews for this driver or use sample reviews for demo purposes
      let reviews = await storage.listReviewsByDriver(driverId);
      
      // For demo purposes, always use sample reviews to show AI capabilities
      if (reviews.length === 0) {
        // Get sample reviews from the localAIService
        const sampleReviews = localAIService.generateSampleReviews(driverId);
        
        // Log that we're using sample reviews
        console.log(`Using ${sampleReviews.length} sample reviews for demo purposes`);
        
        // Use these for processing
        reviews = sampleReviews;
      }

      // Use AI to analyze reviews and generate insights
      const insights = await aiService.calculateDriverInsights(driverId, reviews);

      // Combine with driver information
      return res.status(200).json({
        driverId,
        driverName: driver.name,
        ...insights,
        aiGenerated: true,
        usingLocalAI: isUsingLocalAI()
      });
    } catch (error) {
      console.error("Error getting driver insights:", error);
      return res.status(500).json({ error: "Failed to get driver insights" });
    }
  });

  // Get personalized driver recommendations based on user preferences
  app.post("/api/ai/driver-recommendations", async (req: Request, res: Response) => {
    try {
      const { userId, preferences } = req.body;
      
      if (!userId || !preferences) {
        return res.status(400).json({ error: "User ID and preferences are required" });
      }

      // Get all available drivers
      const drivers = await storage.listDrivers();
      if (drivers.length === 0) {
        return res.status(200).json({ recommendations: [] });
      }

      // Format driver data for AI analysis
      const driverProfiles = drivers.map(d => ({
        id: d.id,
        name: d.name,
        experience: d.experience,
        specialties: d.specialties || [],
        languages: d.languages || [],
        rating: d.rating || 0
      }));

      // Get personalized recommendations
      const recommendations = await aiService.getPersonalizedDriverRecommendations(
        userId,
        preferences,
        driverProfiles
      );

      return res.status(200).json({ 
        recommendations,
        aiGenerated: true,
        usingLocalAI: isUsingLocalAI()
      });
    } catch (error) {
      console.error("Error getting driver recommendations:", error);
      return res.status(500).json({ error: "Failed to get driver recommendations" });
    }
  });

  // Analyze a specific review to extract insights
  app.get("/api/ai/analyze-review/:reviewId", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ error: "Invalid review ID" });
      }

      // Get the review (real or sample)
      let review = await storage.getReview(reviewId);
      
      // If no review found, generate a sample one for demo purposes
      if (!review) {
        console.log(`Using sample review for ID ${reviewId} for demo purposes`);
        // Use the first sample review from driver 1
        const sampleReviews = localAIService.generateSampleReviews(1);
        review = sampleReviews[0];
      }

      // Use AI to analyze the review
      const analysis = await aiService.analyzeReview(review);

      return res.status(200).json({
        reviewId,
        ...analysis,
        aiGenerated: true,
        usingLocalAI: isUsingLocalAI()
      });
    } catch (error) {
      console.error("Error analyzing review:", error);
      return res.status(500).json({ error: "Failed to analyze review" });
    }
  });

  // Get AI assistant response to user query
  app.post("/api/ai/assistant", async (req: Request, res: Response) => {
    try {
      const { query, includeCarInfo, includeDriverInfo } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const context: any = {};

      // Add car information to context if requested
      if (includeCarInfo) {
        const cars = await storage.listCars();
        context.availableCars = cars.map(c => ({
          id: c.id,
          name: c.name,
          brand: c.brand,
          type: c.type,
          price: c.price
        }));
      }

      // Add driver information to context if requested
      if (includeDriverInfo) {
        const drivers = await storage.listDrivers();
        context.availableDrivers = drivers.map(d => ({
          id: d.id,
          name: d.name,
          experience: d.experience,
          specialties: d.specialties || []
        }));
      }

      // Get AI response
      const response = await aiService.getAIAssistantResponse(query, context);

      return res.status(200).json({
        ...response,
        aiGenerated: true,
        usingLocalAI: isUsingLocalAI()
      });
    } catch (error) {
      console.error("Error getting AI assistant response:", error);
      return res.status(500).json({ error: "Failed to get AI assistant response" });
    }
  });
}