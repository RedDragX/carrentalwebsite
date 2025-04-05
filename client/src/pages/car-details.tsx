import { useEffect, useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { formatCurrency, formatRating, calculateTotalPrice, daysBetween } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";
import { UserContext } from "../App";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CarDetails = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoggedIn } = useContext(UserContext);
  
  // State for booking
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [withDriver, setWithDriver] = useState<boolean>(false);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    if (!id) return;
    document.title = "Loading Car Details | Zoro Cars";
  }, [id]);
  
  // Fetch car details
  const { data: carData, isLoading: isLoadingCar, error: carError } = useQuery({
    queryKey: [`/api/cars/${id}`],
    enabled: !!id
  });
  
  // Fetch drivers for the driver selection
  const { data: driversData, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["/api/drivers"],
    enabled: withDriver,
  });
  
  useEffect(() => {
    if (carData?.car) {
      document.title = `${carData.car.name} | Zoro Cars`;
    }
  }, [carData]);
  
  // Calculate total price when dates or withDriver changes
  useEffect(() => {
    if (startDate && endDate && carData?.car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start > end) {
        setTotalPrice(0);
        return;
      }
      
      const days = daysBetween(start, end);
      if (days <= 0) {
        setTotalPrice(0);
        return;
      }
      
      const price = calculateTotalPrice(carData.car.price, days, withDriver);
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, withDriver, carData]);
  
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login or register to book a car",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate || !endDate || !location) {
      toast({
        title: "Missing information",
        description: "Please fill all the required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (withDriver && !selectedDriverId) {
      toast({
        title: "Driver selection required",
        description: "Please select a driver or disable the driver option",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the booking data
      const bookingData = {
        userId: user?.id,
        carId: parseInt(id as string),
        driverId: withDriver ? selectedDriverId : null,
        startDate,
        endDate,
        location,
        totalPrice,
        status: "pending",
      };
      
      // Send booking request to the API
      const response = await apiRequest("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      
      if (response.ok) {
        toast({
          title: "Booking successful!",
          description: "Your booking has been confirmed. Check your profile for details.",
        });
        
        // Reset form
        setStartDate("");
        setEndDate("");
        setLocation("");
        setWithDriver(false);
        setSelectedDriverId(null);
      } else {
        throw new Error("Failed to process booking");
      }
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingCar) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 w-1/3 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-60 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (carError || !carData?.car) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Car not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The car you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/cars" className="btn btn-primary">
            View all cars
          </Link>
        </div>
      </div>
    );
  }
  
  const { car } = carData;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/cars" className="text-violet-600 dark:text-violet-400 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all cars
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold font-space text-gray-900 dark:text-white mb-2">{car.name}</h1>
        
        <div className="flex items-center flex-wrap gap-3 mb-6">
          <div className="flex items-center">
            <StarRating value={car.rating} size={20} />
            <span className="ml-2 text-gray-700 dark:text-gray-300">{formatRating(car.rating)} ({car.reviewCount} reviews)</span>
          </div>
          <span className="inline-block h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></span>
          <div className="badge badge-lg badge-primary">{car.type}</div>
          <span className="inline-block h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></span>
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-bold text-violet-700 dark:text-violet-500">{formatCurrency(car.price)}</span> / day
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative">
                <img 
                  src={car.images[0]} 
                  alt={car.name} 
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
                {!car.available && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-red-600 text-white text-lg font-bold py-2 px-6 rounded-md">
                      Currently Unavailable
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex mb-6 border-b dark:border-gray-700">
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'details' ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Car Details
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'features' ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('features')}
                  >
                    Features
                  </button>
                </div>
                
                {activeTab === "details" && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{car.description}</p>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-4">Specifications</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-6">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Top Speed</h4>
                          <p className="text-gray-700 dark:text-gray-300">{car.topSpeed} mph</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Seating Capacity</h4>
                          <p className="text-gray-700 dark:text-gray-300">{car.seats} seats</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Transmission</h4>
                          <p className="text-gray-700 dark:text-gray-300">{car.transmission}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Fuel Type</h4>
                          <p className="text-gray-700 dark:text-gray-300">{car.fuelType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "features" && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-4">Features</h3>
                    
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {car.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Booking form */}
          <div className="lg:col-span-1">
            <div className="glass-card overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary/90 to-violet-600/90 p-5 relative">
                <h3 className="text-xl font-bold text-white font-space">Book this car</h3>
                <p className="text-white/80 text-sm mt-1 font-poppins">
                  Experience luxury at your fingertips
                </p>
                
                {/* Decorative elements */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Form section with glass effect */}
              <form onSubmit={handleBooking} className="p-6 space-y-5 bg-gray-900/70 backdrop-blur-sm">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
                      placeholder="Enter city or airport"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">Pickup Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">Return Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="withDriver"
                      checked={withDriver}
                      onChange={(e) => setWithDriver(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary/80 border-gray-600 rounded"
                    />
                    <label htmlFor="withDriver" className="ml-2 block text-sm text-gray-200 font-medium font-outfit">
                      Need a professional driver?
                    </label>
                  </div>
                  
                  {withDriver && (
                    <div className="mt-3 pl-6 border-l-2 border-primary/30">
                      <label htmlFor="driver" className="block text-sm font-medium text-gray-200 font-outfit mb-1.5">Select Driver</label>
                      {isLoadingDrivers ? (
                        <div className="mt-1 h-10 w-full animate-pulse bg-gray-700/70 rounded-lg"></div>
                      ) : (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <select
                            id="driver"
                            value={selectedDriverId || ""}
                            onChange={(e) => setSelectedDriverId(parseInt(e.target.value))}
                            className="pl-10 w-full py-2.5 bg-gray-800/70 border border-gray-700/50 rounded-lg text-gray-100 font-quicksand text-sm focus:ring-primary focus:border-primary transition-all"
                            required={withDriver}
                          >
                            <option value="">Select a driver</option>
                            {driversData?.drivers.map((driver: any) => (
                              <option key={driver.id} value={driver.id}>
                                {driver.name} ({driver.experience} years exp.)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Price summary */}
                <div className="mt-6 pt-5 border-t border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-outfit">Price per day:</span>
                    <span className="font-medium text-white font-space">{formatCurrency(car.price)}</span>
                  </div>
                  
                  {totalPrice > 0 && (
                    <>
                      {withDriver && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-300 font-outfit">Driver service:</span>
                          <span className="font-medium text-white font-space">+30%</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4 text-lg">
                        <span className="font-bold bg-gradient-to-r from-primary to-violet-400 text-transparent bg-clip-text">Total:</span>
                        <span className="font-bold font-space bg-gradient-to-r from-primary to-violet-400 text-transparent bg-clip-text">
                          {formatCurrency(totalPrice)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Book Now button */}
                <button
                  type="submit"
                  disabled={isSubmitting || totalPrice <= 0}
                  className={`w-full mt-6 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white py-3.5 px-4 rounded-lg font-medium transition-all shadow-lg font-space ${(isSubmitting || totalPrice <= 0) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-primary/20 hover:shadow-xl'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Book Now'}
                </button>
                
                {!isLoggedIn && (
                  <div className="mt-4 text-sm text-gray-400 text-center font-outfit border-t border-gray-700/30 pt-4">
                    <span>Please </span>
                    <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                      Login
                    </Link> 
                    <span> or </span>
                    <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
                      Register
                    </Link>
                    <span> to book this car</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;