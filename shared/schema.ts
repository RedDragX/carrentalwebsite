import { pgTable, text, serial, integer, boolean, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cars schema
export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull(), // luxury, sports, SUV, convertible, sedan
  seats: integer("seats").notNull(),
  topSpeed: integer("top_speed").notNull(), // in km/h
  price: integer("price").notNull(), // per day in dollars
  year: integer("year").notNull(),
  transmission: text("transmission").notNull(), // automatic, manual
  fuelType: text("fuel_type").notNull(), // petrol, diesel, electric, hybrid
  description: text("description").notNull(),
  images: text("images").array(),
  features: text("features").array(),
  available: boolean("available").default(true),
  rating: integer("rating").default(0), // 0-500 (0-5.00)
  reviewCount: integer("review_count").default(0),
});

export const insertCarSchema = createInsertSchema(cars).pick({
  name: true,
  brand: true,
  model: true,
  type: true,
  seats: true,
  topSpeed: true,
  price: true,
  year: true,
  transmission: true,
  fuelType: true,
  description: true,
  images: true,
  features: true,
  available: true,
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

// Drivers schema
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  experience: integer("experience").notNull(), // in years
  image: text("image").notNull(),
  rating: integer("rating").default(0), // 0-500 (0-5.00)
  tripCount: integer("trip_count").default(0),
  description: text("description").notNull(),
  quote: text("quote").notNull(),
  specialties: text("specialties").array(),
  languages: text("languages").array(),
  available: boolean("available").default(true),
});

export const insertDriverSchema = createInsertSchema(drivers).pick({
  name: true,
  experience: true,
  image: true,
  description: true,
  quote: true,
  specialties: true,
  languages: true,
  available: true,
});

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

// Bookings schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  carId: integer("car_id").notNull(),
  driverId: integer("driver_id"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  withDriver: boolean("with_driver").default(false),
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  carId: true,
  driverId: true,
  startDate: true,
  endDate: true,
  location: true,
  totalPrice: true,
  withDriver: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  carId: integer("car_id"),
  driverId: integer("driver_id"),
  bookingId: integer("booking_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  city: text("city"),
  state: text("state"),
}, (table) => {
  return {
    // Ensure a user can only review a specific booking once
    unqReview: unique().on(table.userId, table.bookingId),
  };
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  carId: true,
  driverId: true,
  bookingId: true,
  rating: true,
  comment: true,
  city: true,
  state: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
