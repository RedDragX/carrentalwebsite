import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertBookingSchema,
  insertReviewSchema,
} from "@shared/schema";
import { registerAIRoutes } from "./routes/ai-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Car routes
  app.get("/api/cars", async (req: Request, res: Response) => {
    try {
      const type = req.query.type ? String(req.query.type) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : undefined;
      
      const cars = await storage.listCars({ type, search, limit });
      res.json({ cars });
    } catch (error) {
      console.error("Error listing cars:", error);
      res.status(500).json({ message: "Failed to list cars" });
    }
  });

  app.get("/api/cars/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const car = await storage.getCar(id);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json({ car });
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ message: "Failed to fetch car" });
    }
  });

  // Driver routes
  app.get("/api/drivers", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit)) : undefined;
      const drivers = await storage.listDrivers(limit);
      res.json({ drivers });
    } catch (error) {
      console.error("Error listing drivers:", error);
      res.status(500).json({ message: "Failed to list drivers" });
    }
  });

  app.get("/api/drivers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid driver ID" });
      }
      
      const driver = await storage.getDriver(id);
      
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      
      res.json({ driver });
    } catch (error) {
      console.error("Error fetching driver:", error);
      res.status(500).json({ message: "Failed to fetch driver" });
    }
  });

  // User registration and auth
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: "Registration successful", 
        user: userWithoutPassword 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        message: "Login successful", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Validate car exists
      const car = await storage.getCar(bookingData.carId);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      // Validate driver if provided
      if (bookingData.driverId) {
        const driver = await storage.getDriver(bookingData.driverId);
        if (!driver) {
          return res.status(404).json({ message: "Driver not found" });
        }
      }
      
      // Create booking
      const booking = await storage.createBooking(bookingData);
      
      res.status(201).json({ 
        message: "Booking created successfully", 
        booking 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const bookings = await storage.listBookingsByUser(userId);
      res.json({ bookings });
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Create review and update ratings
      const review = await storage.createReview(reviewData);
      
      res.status(201).json({ 
        message: "Review submitted successfully", 
        review 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to submit review" });
    }
  });

  app.get("/api/reviews/car/:carId", async (req: Request, res: Response) => {
    try {
      const carId = parseInt(req.params.carId);
      
      if (isNaN(carId)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      
      const reviews = await storage.listReviewsByCar(carId);
      res.json({ reviews });
    } catch (error) {
      console.error("Error fetching car reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/driver/:driverId", async (req: Request, res: Response) => {
    try {
      const driverId = parseInt(req.params.driverId);
      
      if (isNaN(driverId)) {
        return res.status(400).json({ message: "Invalid driver ID" });
      }
      
      const reviews = await storage.listReviewsByDriver(driverId);
      res.json({ reviews });
    } catch (error) {
      console.error("Error fetching driver reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Register AI routes
  registerAIRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
