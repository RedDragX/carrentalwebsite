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
    if (!carData?.car || !startDate || !endDate) {
      setTotalPrice(0);
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = daysBetween(start, end);
    
    if (days <= 0) {
      setTotalPrice(0);
      return;
    }
    
    const totalPrice = calculateTotalPrice(carData.car.price, days, withDriver);
    setTotalPrice(totalPrice);
  }, [carData, startDate, endDate, withDriver]);
  
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to book a car",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!startDate || !endDate || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }
    
    if (totalPrice <= 0) {
      toast({
        title: "Invalid booking",
        description: "Please check your dates and try again",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const bookingData = {
        userId: user!.id,
        carId: parseInt(id!),
        driverId: withDriver && selectedDriverId ? selectedDriverId : undefined,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        location,
        totalPrice,
        withDriver
      };
      
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      const data = await response.json();
      
      toast({
        title: "Booking successful",
        description: "Your car has been booked successfully"
      });
      
      // Reset form
      setStartDate("");
      setEndDate("");
      setLocation("");
      setWithDriver(false);
      setSelectedDriverId(null);
      setTotalPrice(0);
      
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingCar) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (carError || !carData?.car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-primary">Car Not Found</h3>
          <p className="mt-2 text-neutral-600">We couldn't find the car you're looking for.</p>
          <Link href="/cars" className="mt-6 inline-block bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark transition-all">
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }
  
  const car = carData.car;
  const displayRating = formatRating(car.rating);
  
  return (
    <div className="bg-white py-12 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/cars" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Cars
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-heading">{car.name}</h1>
          <div className="flex items-center mt-2">
            <span className="bg-violet-600 text-white px-2 py-1 rounded-md text-sm mr-3">{car.type}</span>
            <div className="flex items-center">
              <StarRating rating={displayRating} />
              <span className="ml-1 text-gray-700 dark:text-gray-300">
                {displayRating.toFixed(1)} ({car.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car details and images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main image */}
              <div className="h-72 md:h-96 w-full">
                <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Additional images if available */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2">
                  {car.images.slice(1).map((image, index) => (
                    <div key={index} className="h-20 w-full">
                      <img src={image} alt={`${car.name} view ${index + 2}`} className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-3 text-sm font-medium ${activeTab === "details" ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400" : "text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"}`}
                  >
                    Car Details
                  </button>
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`px-4 py-3 text-sm font-medium ${activeTab === "specs" ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400" : "text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"}`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab("features")}
                    className={`px-4 py-3 text-sm font-medium ${activeTab === "features" ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400" : "text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"}`}
                  >
                    Features
                  </button>
                </div>
              </div>
              
              {/* Tab content */}
              <div className="p-6">
                {activeTab === "details" && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-4">About this car</h3>
                    <p className="text-gray-700 dark:text-gray-300">{car.description}</p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Brand</h4>
                        <p className="text-gray-700 dark:text-gray-300">{car.brand}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Model</h4>
                        <p className="text-gray-700 dark:text-gray-300">{car.model}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Year</h4>
                        <p className="text-gray-700 dark:text-gray-300">{car.year}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Daily Rate</h4>
                        <p className="text-gray-700 dark:text-gray-300">{formatCurrency(car.price)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === "specs" && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-4">Car Specifications</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h2.5a1 1 0 01.8.4l1.5 2a1 1 0 01.2.6V15a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-4.9 0H10a1 1 0 01-1-1v-4a1 1 0 011-1h4z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Seats</h4>
                          <p className="text-gray-700 dark:text-gray-300">{car.seats}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Top Speed</h4>
                          <p className="text-gray-700 dark:text-gray-300">{car.topSpeed} km/h</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 dark:text-violet-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-4">Book this car</h3>
              
              <form onSubmit={handleBooking}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Location</label>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                      placeholder="Enter city or airport"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Date</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Return Date</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="withDriver"
                      checked={withDriver}
                      onChange={(e) => setWithDriver(e.target.checked)}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="withDriver" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Need a professional driver?
                    </label>
                  </div>
                  
                  {withDriver && (
                    <div>
                      <label htmlFor="driver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Driver</label>
                      {isLoadingDrivers ? (
                        <div className="mt-1 h-10 w-full animate-pulse bg-gray-200 dark:bg-gray-600 rounded"></div>
                      ) : (
                        <select
                          id="driver"
                          value={selectedDriverId || ""}
                          onChange={(e) => setSelectedDriverId(parseInt(e.target.value))}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                          required={withDriver}
                        >
                          <option value="">Select a driver</option>
                          {driversData?.drivers.map((driver: any) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} ({driver.experience} years exp.)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Price per day:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(car.price)}</span>
                    </div>
                    
                    {totalPrice > 0 && (
                      <>
                        {withDriver && (
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-700 dark:text-gray-300">Driver service:</span>
                            <span className="font-medium text-gray-900 dark:text-white">+30%</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-4 text-lg font-bold">
                          <span className="text-violet-600 dark:text-violet-400">Total:</span>
                          <span className="text-violet-600 dark:text-violet-400">{formatCurrency(totalPrice)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || totalPrice <= 0}
                    className={`w-full mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 px-4 rounded-md font-medium transition-all ${(isSubmitting || totalPrice <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing...' : 'Book Now'}
                  </button>
                  
                  {!isLoggedIn && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                      <Link href="/login" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">
                        Login
                      </Link> or <Link href="/register" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">
                        Register
                      </Link> to book this car
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
