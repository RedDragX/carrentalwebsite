import { 
  users, type User, type InsertUser,
  cars, type Car, type InsertCar,
  drivers, type Driver, type InsertDriver,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, like } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Car operations
  getCar(id: number): Promise<Car | undefined>;
  listCars(options?: { type?: string; search?: string; limit?: number; }): Promise<Car[]>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: number, car: Partial<Car>): Promise<Car | undefined>;
  
  // Driver operations
  getDriver(id: number): Promise<Driver | undefined>;
  listDrivers(limit?: number): Promise<Driver[]>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, driver: Partial<Driver>): Promise<Driver | undefined>;
  
  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  listBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  listReviewsByCar(carId: number): Promise<Review[]>;
  listReviewsByDriver(driverId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private drivers: Map<number, Driver>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  
  private userId: number;
  private carId: number;
  private driverId: number;
  private bookingId: number;
  private reviewId: number;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.drivers = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    this.userId = 1;
    this.carId = 1;
    this.driverId = 1;
    this.bookingId = 1;
    this.reviewId = 1;
    
    // Initialize with sample data
    this.seedSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Car operations
  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async listCars(options: { type?: string; search?: string; limit?: number; } = {}): Promise<Car[]> {
    let carsArray = Array.from(this.cars.values());
    
    if (options.type) {
      carsArray = carsArray.filter(car => car.type.toLowerCase() === options.type.toLowerCase());
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      carsArray = carsArray.filter(car => 
        car.name.toLowerCase().includes(searchLower) || 
        car.brand.toLowerCase().includes(searchLower) || 
        car.model.toLowerCase().includes(searchLower)
      );
    }
    
    if (options.limit) {
      carsArray = carsArray.slice(0, options.limit);
    }
    
    return carsArray;
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.carId++;
    const car: Car = { 
      ...insertCar, 
      id, 
      rating: 0, 
      reviewCount: 0 
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: number, updates: Partial<Car>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...updates };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async listDrivers(limit?: number): Promise<Driver[]> {
    let driversArray = Array.from(this.drivers.values());
    
    if (limit) {
      driversArray = driversArray.slice(0, limit);
    }
    
    return driversArray;
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = this.driverId++;
    const driver: Driver = { 
      ...insertDriver, 
      id, 
      rating: 0, 
      tripCount: 0 
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriver(id: number, updates: Partial<Driver>): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    
    const updatedDriver = { ...driver, ...updates };
    this.drivers.set(id, updatedDriver);
    return updatedDriver;
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async listBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.userId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      status: "pending" 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async listReviewsByCar(carId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.carId === carId
    );
  }

  async listReviewsByDriver(driverId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.driverId === driverId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const review: Review = { ...insertReview, id };
    this.reviews.set(id, review);
    
    // Update car or driver rating
    if (insertReview.carId) {
      const car = await this.getCar(insertReview.carId);
      if (car) {
        const carReviews = await this.listReviewsByCar(car.id);
        const totalRating = carReviews.reduce((sum, review) => sum + review.rating, 0);
        const newRating = Math.round((totalRating / carReviews.length) * 100);
        await this.updateCar(car.id, { 
          rating: newRating,
          reviewCount: carReviews.length
        });
      }
    }
    
    if (insertReview.driverId) {
      const driver = await this.getDriver(insertReview.driverId);
      if (driver) {
        const driverReviews = await this.listReviewsByDriver(driver.id);
        const totalRating = driverReviews.reduce((sum, review) => sum + review.rating, 0);
        const newRating = Math.round((totalRating / driverReviews.length) * 100);
        await this.updateDriver(driver.id, { 
          rating: newRating,
          tripCount: driverReviews.length
        });
      }
    }
    
    return review;
  }

  // Seed sample data for development
  private seedSampleData() {
    // Seed cars
    const sampleCars: InsertCar[] = [
      {
        name: "Lamborghini Aventador",
        brand: "Lamborghini",
        model: "Aventador",
        type: "Luxury",
        seats: 2,
        topSpeed: 350,
        price: 899,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "Experience the ultimate supercar with the Lamborghini Aventador. This iconic vehicle represents the pinnacle of Italian engineering and design.",
        images: ["https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"],
        features: ["Carbon Fiber Interior", "V12 Engine", "Butterfly Doors", "Custom Exhaust System", "Racing Mode"],
        available: true,
      },
      {
        name: "Ferrari 488",
        brand: "Ferrari",
        model: "488",
        type: "Sports",
        seats: 2,
        topSpeed: 330,
        price: 799,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The Ferrari 488 combines breathtaking performance with exceptional handling for an unmatched driving experience.",
        images: ["https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"],
        features: ["Turbo V8 Engine", "Carbon Ceramic Brakes", "Adaptive Suspension", "Launch Control", "Ferrari Infotainment System"],
        available: true,
      },
      {
        name: "Porsche 911",
        brand: "Porsche",
        model: "911",
        type: "Sports",
        seats: 4,
        topSpeed: 310,
        price: 599,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "A legendary sports car offering the perfect balance of everyday usability and track-ready performance.",
        images: ["https://images.unsplash.com/photo-1555652736-e92021d28a17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"],
        features: ["Twin-Turbo Flat-Six Engine", "Sport Chrono Package", "Adaptive Sport Seats", "Premium Sound System", "Rear-Wheel Steering"],
        available: true,
      },
      {
        name: "Rolls Royce Phantom",
        brand: "Rolls Royce",
        model: "Phantom",
        type: "Luxury",
        seats: 5,
        topSpeed: 250,
        price: 1200,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The epitome of luxury and craftsmanship, the Phantom offers an unrivaled chauffeur-driven experience.",
        images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"],
        features: ["Starlight Headliner", "Whisper-Quiet V12 Engine", "Rear Privacy Suite", "Bespoke Interior Trim", "Champagne Cooler"],
        available: true,
      },
      {
        name: "Bentley Continental GT",
        brand: "Bentley",
        model: "Continental GT",
        type: "Luxury",
        seats: 4,
        topSpeed: 325,
        price: 850,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The Continental GT combines exquisite luxury with exhilarating performance for a truly exceptional grand touring experience.",
        images: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"],
        features: ["Handcrafted Interior", "Rotating Dashboard Display", "Active All-Wheel Drive", "Air Suspension", "Custom Audio System"],
        available: true,
      },
      {
        name: "Aston Martin DB11",
        brand: "Aston Martin",
        model: "DB11",
        type: "Sports",
        seats: 2,
        topSpeed: 300,
        price: 750,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The DB11 exemplifies Aston Martin's commitment to beautiful proportions, powerful performance, and refined elegance.",
        images: ["https://images.unsplash.com/photo-1623006697366-e766b8712ad8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"],
        features: ["Twin-Turbocharged V12", "Adaptive Damping", "Bang & Olufsen Audio", "Bridge of Weir Leather", "360-Degree Camera System"],
        available: true,
      },
    ];
    
    sampleCars.forEach(car => {
      this.createCar(car);
    });
    
    // Set some initial ratings
    this.updateCar(1, { rating: 490, reviewCount: 124 });
    this.updateCar(2, { rating: 480, reviewCount: 98 });
    this.updateCar(3, { rating: 470, reviewCount: 87 });
    this.updateCar(4, { rating: 500, reviewCount: 156 });
    this.updateCar(5, { rating: 490, reviewCount: 112 });
    this.updateCar(6, { rating: 480, reviewCount: 95 });
    
    // Seed drivers
    const sampleDrivers: InsertDriver[] = [
      {
        name: "James Wilson",
        experience: 10,
        image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        description: "James is an experienced chauffeur specializing in luxury and executive transportation.",
        quote: "Exceptional service, knows all the city's shortcuts.",
        specialties: ["Luxury Cars", "City Navigation", "Executive Transport"],
        languages: ["English", "Spanish"],
        available: true,
      },
      {
        name: "Sarah Johnson",
        experience: 8,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
        description: "Sarah is known for her professional service and attention to detail for all clients.",
        quote: "Professional, punctual and a very safe driver.",
        specialties: ["Corporate Events", "Airport Transfers", "Wedding Transportation"],
        languages: ["English", "French"],
        available: true,
      },
      {
        name: "Michael Brown",
        experience: 12,
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1148&q=80",
        description: "Michael is our most experienced driver with expertise in luxury and sports vehicles.",
        quote: "Expert in luxury vehicles with impeccable service.",
        specialties: ["Sports Cars", "Luxury Sedans", "VIP Services"],
        languages: ["English", "German", "Italian"],
        available: true,
      },
      {
        name: "Emily Davis",
        experience: 7,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
        description: "Emily provides a friendly and professional service with excellent knowledge of local attractions.",
        quote: "Knowledgeable, courteous and excellent driving skills.",
        specialties: ["Tourism", "Scenic Routes", "Airport Transfers"],
        languages: ["English", "Chinese"],
        available: true,
      },
    ];
    
    sampleDrivers.forEach(driver => {
      this.createDriver(driver);
    });
    
    // Set initial ratings and trip counts
    this.updateDriver(1, { rating: 500, tripCount: 124 });
    this.updateDriver(2, { rating: 450, tripCount: 98 });
    this.updateDriver(3, { rating: 500, tripCount: 156 });
    this.updateDriver(4, { rating: 500, tripCount: 87 });
    
    // Seed admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be properly hashed
      email: "admin@zorocars.com",
      fullName: "Admin User",
      phone: "+1234567890",
    });
  }
}

// Export a singleton instance
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Car operations
  async getCar(id: number): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car || undefined;
  }

  async listCars(options: { type?: string; search?: string; limit?: number; } = {}): Promise<Car[]> {
    let query = db.select().from(cars);
    
    if (options.type) {
      query = query.where(eq(cars.type, options.type));
    }
    
    if (options.search) {
      query = query.where(
        sql`(${cars.name} ILIKE ${`%${options.search}%`} OR 
             ${cars.brand} ILIKE ${`%${options.search}%`} OR 
             ${cars.model} ILIKE ${`%${options.search}%`})`
      );
    }
    
    query = query.orderBy(desc(cars.rating));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query;
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const [car] = await db.insert(cars).values({
      ...insertCar,
      rating: 0,
      reviewCount: 0
    }).returning();
    return car;
  }

  async updateCar(id: number, carUpdate: Partial<Car>): Promise<Car | undefined> {
    const [updatedCar] = await db
      .update(cars)
      .set(carUpdate)
      .where(eq(cars.id, id))
      .returning();
    return updatedCar || undefined;
  }

  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver || undefined;
  }

  async listDrivers(limit?: number): Promise<Driver[]> {
    let query = db.select().from(drivers).orderBy(desc(drivers.rating));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const [driver] = await db.insert(drivers).values({
      ...insertDriver,
      rating: 0,
      tripCount: 0
    }).returning();
    return driver;
  }

  async updateDriver(id: number, driverUpdate: Partial<Driver>): Promise<Driver | undefined> {
    const [updatedDriver] = await db
      .update(drivers)
      .set(driverUpdate)
      .where(eq(drivers.id, id))
      .returning();
    return updatedDriver || undefined;
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async listBookingsByUser(userId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.startDate));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        status: "pending"
      })
      .returning();
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async listReviewsByCar(carId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.carId, carId))
      .orderBy(desc(reviews.id));
  }

  async listReviewsByDriver(driverId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.driverId, driverId))
      .orderBy(desc(reviews.id));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    
    // Update car or driver rating
    if (insertReview.carId) {
      const carReviews = await this.listReviewsByCar(insertReview.carId);
      if (carReviews.length > 0) {
        const totalRating = carReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = Math.round((totalRating / carReviews.length) * 100);
        await this.updateCar(insertReview.carId, { 
          rating: newRating,
          reviewCount: carReviews.length
        });
      }
    }
    
    if (insertReview.driverId) {
      const driverReviews = await this.listReviewsByDriver(insertReview.driverId);
      if (driverReviews.length > 0) {
        const totalRating = driverReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = Math.round((totalRating / driverReviews.length) * 100);
        await this.updateDriver(insertReview.driverId, { 
          rating: newRating,
          tripCount: driverReviews.length
        });
      }
    }
    
    return review;
  }
}

// Initialize database with sample data if needed
async function initializeDatabase() {
  // Check if there are any cars in the database
  const existingCars = await db.select({ count: sql`count(*)` }).from(cars);
  const carCount = Number(existingCars[0].count);
  
  if (carCount === 0) {
    console.log("Initializing database with sample data...");
    
    // Sample cars
    const sampleCars = [
      {
        name: "Lamborghini Aventador",
        brand: "Lamborghini",
        model: "Aventador",
        type: "Luxury",
        seats: 2,
        topSpeed: 350,
        price: 899,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "Experience the ultimate supercar with the Lamborghini Aventador. This iconic vehicle represents the pinnacle of Italian engineering and design.",
        images: ["https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80"],
        features: ["Carbon Fiber Interior", "V12 Engine", "Butterfly Doors", "Custom Exhaust System", "Racing Mode"],
        available: true,
        rating: 490,
        reviewCount: 124
      },
      {
        name: "Ferrari 488",
        brand: "Ferrari",
        model: "488",
        type: "Sports",
        seats: 2,
        topSpeed: 330,
        price: 799,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The Ferrari 488 combines breathtaking performance with exceptional handling for an unmatched driving experience.",
        images: ["https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"],
        features: ["Turbo V8 Engine", "Carbon Ceramic Brakes", "Adaptive Suspension", "Launch Control", "Ferrari Infotainment System"],
        available: true,
        rating: 480,
        reviewCount: 98
      },
      {
        name: "Porsche 911",
        brand: "Porsche",
        model: "911",
        type: "Sports",
        seats: 4,
        topSpeed: 310,
        price: 599,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "A legendary sports car offering the perfect balance of everyday usability and track-ready performance.",
        images: ["https://images.unsplash.com/photo-1555652736-e92021d28a17?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"],
        features: ["Twin-Turbo Flat-Six Engine", "Sport Chrono Package", "Adaptive Sport Seats", "Premium Sound System", "Rear-Wheel Steering"],
        available: true,
        rating: 470,
        reviewCount: 87
      },
      {
        name: "Rolls Royce Phantom",
        brand: "Rolls Royce",
        model: "Phantom",
        type: "Luxury",
        seats: 5,
        topSpeed: 250,
        price: 1200,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The epitome of luxury and craftsmanship, the Phantom offers an unrivaled chauffeur-driven experience.",
        images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"],
        features: ["Starlight Headliner", "Whisper-Quiet V12 Engine", "Rear Privacy Suite", "Bespoke Interior Trim", "Champagne Cooler"],
        available: true,
        rating: 500,
        reviewCount: 156
      },
      {
        name: "Bentley Continental GT",
        brand: "Bentley",
        model: "Continental GT",
        type: "Luxury",
        seats: 4,
        topSpeed: 325,
        price: 850,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The Continental GT combines exquisite luxury with exhilarating performance for a truly exceptional grand touring experience.",
        images: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"],
        features: ["Handcrafted Interior", "Rotating Dashboard Display", "Active All-Wheel Drive", "Air Suspension", "Custom Audio System"],
        available: true,
        rating: 490,
        reviewCount: 112
      },
      {
        name: "Aston Martin DB11",
        brand: "Aston Martin",
        model: "DB11",
        type: "Sports",
        seats: 2,
        topSpeed: 300,
        price: 750,
        year: 2022,
        transmission: "Automatic",
        fuelType: "Petrol",
        description: "The DB11 exemplifies Aston Martin's commitment to beautiful proportions, powerful performance, and refined elegance.",
        images: ["https://images.unsplash.com/photo-1623006697366-e766b8712ad8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"],
        features: ["Twin-Turbocharged V12", "Adaptive Damping", "Bang & Olufsen Audio", "Bridge of Weir Leather", "360-Degree Camera System"],
        available: true,
        rating: 480,
        reviewCount: 95
      }
    ];
    
    // Sample drivers
    const sampleDrivers = [
      {
        name: "James Wilson",
        experience: 10,
        image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        description: "James is an experienced chauffeur specializing in luxury and executive transportation.",
        quote: "Exceptional service, knows all the city's shortcuts.",
        specialties: ["Luxury Cars", "City Navigation", "Executive Transport"],
        languages: ["English", "Spanish"],
        available: true,
        rating: 500,
        tripCount: 124
      },
      {
        name: "Sarah Johnson",
        experience: 8,
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
        description: "Sarah is known for her professional service and attention to detail for all clients.",
        quote: "Professional, punctual and a very safe driver.",
        specialties: ["Corporate Events", "Airport Transfers", "Wedding Transportation"],
        languages: ["English", "French"],
        available: true,
        rating: 450,
        tripCount: 98
      },
      {
        name: "Michael Brown",
        experience: 12,
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1148&q=80",
        description: "Michael is our most experienced driver with expertise in luxury and sports vehicles.",
        quote: "Expert in luxury vehicles with impeccable service.",
        specialties: ["Sports Cars", "Luxury Sedans", "VIP Services"],
        languages: ["English", "German", "Italian"],
        available: true,
        rating: 500,
        tripCount: 156
      },
      {
        name: "Emily Davis",
        experience: 7,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
        description: "Emily provides a friendly and professional service with excellent knowledge of local attractions.",
        quote: "Knowledgeable, courteous and excellent driving skills.",
        specialties: ["Tourism", "Scenic Routes", "Airport Transfers"],
        languages: ["English", "Chinese"],
        available: true,
        rating: 500,
        tripCount: 87
      }
    ];
    
    // Add sample admin user
    await db.insert(users).values({
      username: "admin",
      password: "admin123", // In a real app, this would be properly hashed
      email: "admin@zorocars.com",
      fullName: "Admin User",
      phone: "+1234567890",
      isAdmin: true
    });
    
    // Insert sample cars
    await db.insert(cars).values(sampleCars);
    
    // Insert sample drivers
    await db.insert(drivers).values(sampleDrivers);
    
    console.log("Database initialized with sample data.");
  }
}

// Initialize the database when the application starts
initializeDatabase().catch(error => {
  console.error("Failed to initialize database:", error);
});

// Export a singleton instance
export const storage = new DatabaseStorage();
